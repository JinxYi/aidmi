-- inserts a row into public.profiles
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
DECLARE
  user_role TEXT;
BEGIN
  INSERT INTO public.clients (id, created_at, first_name, last_name)
  VALUES (
    new.id, 
    new.created_at,
    new.raw_user_meta_data->>'first_name', 
    new.raw_user_meta_data->>'last_name'
  );

  -- Extract the role from the metadata
  user_role := NEW.raw_user_meta_data->>'role';

  -- If the role is 'patient', insert into the patients table
  IF user_role = 'patient' THEN

    -- Insert a new record into the patients table
    INSERT INTO public.patients (client_id, age, gender)
    VALUES (NEW.id, (NEW.raw_user_meta_data->>'age')::INT, new.raw_user_meta_data->>'gender');
  END IF;

  IF user_role = 'clinician' THEN

    -- Insert a new record into the patients table
    INSERT INTO public.clinicians (client_id, occupation, qualification)
    VALUES (NEW.id, (NEW.raw_user_meta_data->>'occupation')::INT, new.raw_user_meta_data->>'qualification');
  END IF;

  RETURN new;
END;
$$;

-- trigger the function every time a user is created
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
