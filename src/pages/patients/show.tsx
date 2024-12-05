import { CollectedInfoApi } from "@/api/collected-info/collected-info-api";
import { DiagnosisApi } from "@/api/diagnosis/diagnosis-api";
import { MessageHighlightsApi } from "@/api/message-highlight/message-highlights-api";
import { ClientPatientDto } from "@/api/patient/dto";
import { clientPatientDtoToPatient } from "@/api/patient/transform";
import EmptyPlaceholder from "@/components/empty-placeholder";
import SimpleList from "@/components/simple-list";
import Small from "@/components/small";
import {
  CategorisedInfo,
  Consultation,
  MessageHighlights,
  Patient,
} from "@/domain";
import { capitalize } from "@/utils/pipes";
import {
  DownloadOutlined,
  LinkOutlined,
  PrinterOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { Show } from "@refinedev/antd";
import { useGo, useNotification, useOne } from "@refinedev/core";
import {
  Breadcrumb,
  Button,
  Card,
  Col,
  Drawer,
  Flex,
  Modal,
  Row,
  Skeleton,
  Space,
  Typography,
} from "antd";
import { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { useParams } from "react-router-dom";
import CollectedInfoWidget from "./components/collected-info-widget";
import PatientDocumentsWidget from "./components/patient-documents-widget";
import PatientFlags from "./components/patient-flags";
import PersonalInfo from "./components/personal-info";
import UploadPatientDocuments from "./components/upload-patient-documents";
import MessageHighlightsWidget from "./components/message-highlights-widget";
import PatientNotesWidget from "./components/patient-notes-widget";
var { Title } = Typography;

type Series = {
  name: string;
  data: number[];
};

type ChartOptions = {
  chart: {
    height: number;
    type:
      | "radar"
      | "area"
      | "line"
      | "bar"
      | "pie"
      | "donut"
      | "radialBar"
      | "scatter"
      | "bubble"
      | "heatmap"
      | "candlestick"
      | "boxPlot"
      | "polarArea"
      | "rangeBar"
      | "rangeArea"
      | "treemap";
  };
  title: {
    text: string;
  };
  yaxis: {
    stepSize: number;
  };
  xaxis: {
    categories: string[];
  };
};

type MessageHighlightsDictionary = {
  [key: string]: MessageHighlights[];
};

const PatientDetails: React.FC = () => {
  const { id } = useParams(); // assuming you're using React Router
  const [consultation, setConsultation] = useState<Consultation>();
  const [collectedInfo, setCollectedInfo] = useState<CategorisedInfo>();
  const [isSummaryLoading, setIsSummaryLoading] = useState(true);

  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [messageHighlights, setMessageHighlights] =
    useState<MessageHighlightsDictionary>({});

  const { open, close } = useNotification();
  const [openDrawer, setOpenDrawer] = useState(false);

  const [series, setSeries] = useState<Series[]>();
  const [chartOptions, setChartOptions] = useState<ChartOptions>({
    chart: {
      height: 500,
      type: "radar",
    },
    title: {
      text: "",
    },
    yaxis: {
      stepSize: 20,
    },
    xaxis: {
      categories: [
        "Depression",
        "Anxiety",
        "Bipolar",
        "OCD",
        "Schizophrenia",
        "Eating Disorder",
        "ADHD",
        "PTSD",
        "Subst",
        "Depression",
      ],
    },
  });
  const { data, isLoading, isError } = useOne<ClientPatientDto>({
    resource: "clients", // replace with your resource name
    id,
    dataProviderName: "default",
    queryOptions: {
      enabled: !!id, // only fetch data when id is present
    },
    meta: {
      select:
        "*, patients(id, age, gender, last_education, marriage_status, job)",
    },
  });
  const patient: Patient | null = data?.data
    ? clientPatientDtoToPatient(data.data)
    : null;

  useEffect(() => {
    async function fetchData() {
      if (patient && patient.id) {
        try {
          setIsSummaryLoading(true);
          const latestInfo =
            await CollectedInfoApi.getRecentConsultationSummary(patient.id);
          const { consultation, collectedInfo } = latestInfo;
          if (!consultation) return; // no consultations by the patient
          if (!collectedInfo) return; // no summary report generated for patient
          setConsultation(consultation);

          setCollectedInfo(collectedInfo);
          setLastUpdated(collectedInfo.key_symptoms.created_at || null);
          setSymptoms(JSON.parse(collectedInfo.key_symptoms.content));

          if (!consultation || !consultation.id) return;
          const messageHighlightsData =
            await MessageHighlightsApi.getHighlights(consultation.id);

          if (!messageHighlightsData || messageHighlightsData.length == 0)
            throw new Error("Could not get consultation highlights");
          const categorizedMessage = messageHighlightsData.reduce(
            (acc: any, current: MessageHighlights) => {
              const category = current.category;
              if (!acc[category]) {
                acc[category] = [];
              }
              acc[category].push(current);
              return acc;
            },
            {}
          );
          setMessageHighlights(categorizedMessage);

          try {
            const diagnosis = await DiagnosisApi.getDiagnosis(consultation.id);
            if (!diagnosis) throw new Error("Could not get diagnosis");
            if (Object.keys(diagnosis).length == 0) {
              // if object is
            }

            setChartOptions({
              ...chartOptions,
              xaxis: {
                categories: Object.keys(diagnosis).map((d) =>
                  capitalize(d.split("_").join(" "))
                ),
              },
            });
            let seriesData: number[] = [];
            Object.values(diagnosis).map((d) => {
              seriesData.push(d.score);
            });
            if (seriesData.length != 0) {
              setSeries([
                {
                  name: "Likelihood Scores",
                  data: seriesData,
                },
              ]);
            }
          } catch (error) {
            console.error("Error retrieving diagnosis", error);
            open?.({
              type: "error",
              message: "Could not fetch diagnosis",
              description: "An error occured while trying to get diagnosis.",
              key: "diagnosis-notification-key",
            });
          }
        } catch (err) {
          open?.({
            type: "error",
            message: "Could not fetch patient summary",
            description:
              "An error occured while trying to get patient summary.",
            key: "notification-key",
          });
        } finally {
          setIsSummaryLoading(false);
        }
      }
    }

    // try{
    fetchData();
  }, [data]);
  const go = useGo();

  const showMessageHighlights = async () => {
    setOpenDrawer(true);
  };
  const onDrawerClose = () => {
    setOpenDrawer(false);
  };

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const closeUploadModal = () => {
    setIsUploadModalOpen(false);
  };
  const showUploadModal = () => {
    setIsUploadModalOpen(true);
  };

  return (
    <div>
      <Drawer
        title={
          <Flex vertical>
            <Title level={5} style={{ marginBottom: 0 }}>
              Collected Patient Information
            </Title>
            <Small>
              Relevant Information gathered for your psychiatric evaluation
            </Small>
          </Flex>
        }
        placement="right"
        size="large"
        onClose={onDrawerClose}
        open={openDrawer}
        extra={
          <Space>
            <Button
              icon={<PrinterOutlined />}
              type="default"
              onClick={onDrawerClose}
            ></Button>
            <Button
              icon={<DownloadOutlined />}
              type="default"
              onClick={onDrawerClose}
            ></Button>
          </Space>
        }
      >
        {messageHighlights && (
          <MessageHighlightsWidget
            data={messageHighlights}
          ></MessageHighlightsWidget>
        )}
      </Drawer>
      <Flex vertical gap="large">
        <Show
          // isLoading={isLoading}
          title="Patient Profile"
          headerProps={{
            subTitle: "Patient Info",
          }}
          breadcrumb={
            <Breadcrumb
              className="text-blue-500 ml-2"
              items={[
                {
                  title: (
                    <a>
                      <UnorderedListOutlined /> Patients
                    </a>
                  ),
                  onClick: () => {
                    go({
                      to: {
                        resource: "patients",
                        action: "list",
                      },
                    });
                  },
                },
                {
                  title: `${
                    patient?.first_name || patient?.last_name
                      ? patient?.first_name + " " + patient?.last_name
                      : "Unknown"
                  }`,
                },
              ]}
            />
          }
        >
          <Skeleton avatar active loading={isLoading} paragraph={{ rows: 1 }}>
            {patient ? (
              <PersonalInfo patient={patient} lastUpdated={lastUpdated} />
            ) : (
              <EmptyPlaceholder />
            )}
          </Skeleton>
        </Show>
        <Row gutter={24}>
          <Col span={24} md={{ span: 12 }}>
            <Flex vertical gap="large">
              <Card bordered={false} className="p-0">
                <Flex justify="space-between">
                  <Title level={5}>Collected Information</Title>
                  <Button
                    color="primary"
                    variant="text"
                    size="small"
                    onClick={showMessageHighlights}
                  >
                    View
                  </Button>
                </Flex>
                <Skeleton loading={isSummaryLoading} active>
                  {patient && collectedInfo ? (
                    <CollectedInfoWidget
                      patient={patient}
                      collectedInfo={collectedInfo}
                    />
                  ) : (
                    <EmptyPlaceholder />
                  )}
                </Skeleton>
              </Card>
              <Card bordered={false}>
                <Title level={5}>Key Symptoms</Title>
                <Skeleton loading={isSummaryLoading} active>
                  <SimpleList data={symptoms} />
                </Skeleton>
              </Card>
              <Card bordered={false}>
                <Title level={5}>Psychiatrist Notes</Title>
                {patient ? (
                  <PatientNotesWidget patient={patient} />
                ) : (
                  <Skeleton avatar active />
                )}
              </Card>
              <Modal
                centered
                title="Attach a File"
                open={isUploadModalOpen}
                // onOk={handleEndConsultation}
                footer={<></>}
                onCancel={closeUploadModal}
              >
                {patient && <UploadPatientDocuments patient={patient} />}
              </Modal>
              <Card
                title={
                  <Flex justify="space-between">
                    <span>Collected Information</span>
                    <Button
                      color="primary"
                      size="small"
                      onClick={showUploadModal}
                      icon={<LinkOutlined />}
                    >
                      Attach
                    </Button>
                  </Flex>
                }
                bordered={false}
              >
                {patient ? (
                  <PatientDocumentsWidget patient={patient} />
                ) : (
                  <Skeleton avatar active />
                )}
              </Card>
            </Flex>
          </Col>
          <Col span={24} md={{ span: 12 }}>
            <Flex vertical flex="1">
              <Flex vertical gap="large">
                <Card title="Flags" bordered={false}>
                  {patient ? (
                    <PatientFlags patient={patient}></PatientFlags>
                  ) : (
                    <EmptyPlaceholder />
                  )}
                </Card>
                <Card title="Diagnosis" bordered={false}>
                  {series ? (
                    <ReactApexChart
                      options={chartOptions}
                      series={series}
                      type="radar"
                      height={600}
                    />
                  ) : (
                    <EmptyPlaceholder />
                  )}
                </Card>
              </Flex>
            </Flex>
          </Col>
        </Row>
      </Flex>
    </div>
  );
};

export default PatientDetails;
