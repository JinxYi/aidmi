export const customTitleHandler = ({ resource, action, params }: any) => {
  let title = "AidMi"; // Default title
  if (resource && action) {
    title = `${resource} ${action} ${params.id}`;
  }
  return title;
};
