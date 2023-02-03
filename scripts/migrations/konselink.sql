-- konselink_user
CREATE TABLE public.konselink_user (
	username varchar NOT NULL,
	npm varchar(10) NULL,
	nip varchar(10) NULL,
	fakultas varchar NULL,
	program_studi varchar NULL,
	program_edukasi varchar NULL,
	user_role varchar(10) NULL,
	"name" varchar NULL,
	id serial NOT NULL,
	login_type varchar(6) NOT NULL,
	"password" varchar NULL,
	CONSTRAINT konselink_user_pk PRIMARY KEY (id),
	CONSTRAINT konselink_user_un UNIQUE (username, login_type)
);

-- klien_data
CREATE TABLE public.klien_data (
	address varchar NULL,
	college_data varchar NULL,
	current_education varchar NULL,
	effort_done text NULL,
	elementary_data varchar NULL,
	gender bpchar(1) NULL,
	has_consulted bool NOT NULL DEFAULT false,
	junior_data varchar NULL,
	kindergarten_data varchar NULL,
	phone_number varchar(15) NULL,
	problem text NULL,
	religion varchar NULL,
	senior_data varchar NULL,
	birth_place varchar NULL,
	birth_day int4 NULL,
	birth_month int4 NULL,
	birth_year int4 NULL,
	"name" varchar NULL,
	user_id int4 NOT NULL,
	complaint varchar NULL,
	solution varchar NULL,
	year_consulted int4 NULL,
	month_consulted int4 NULL,
	place_consulted varchar NULL,
	has_display_picture bool NOT NULL DEFAULT false,
	is_verified bool NOT NULL DEFAULT false,
	CONSTRAINT klien_data_pk PRIMARY KEY (user_id)
);
ALTER TABLE public.klien_data ADD CONSTRAINT klien_data_fk FOREIGN KEY (user_id) REFERENCES konselink_user(id) ON UPDATE CASCADE ON DELETE CASCADE;

-- klien_parents_data
CREATE TABLE public.klien_parents_data (
	address varchar NULL,
	age int4 NULL,
	education varchar NULL,
	"name" varchar NULL,
	occupation varchar NULL,
	religion varchar NULL,
	tribe varchar NULL,
	user_id int4 NOT NULL,
	"type" varchar(6) NOT NULL,
	CONSTRAINT klien_parents_data_pk PRIMARY KEY (type, user_id)
);
ALTER TABLE public.klien_parents_data ADD CONSTRAINT klien_parents_data_fk FOREIGN KEY (user_id) REFERENCES klien_data(user_id) ON UPDATE CASCADE ON DELETE CASCADE;

-- klien_siblings_data
CREATE TABLE public.klien_siblings_data (
	sibling_number int4 NOT NULL,
	age int4 NULL,
	education varchar NULL,
	gender bpchar(1) NULL,
	"name" varchar NULL,
	user_id int4 NOT NULL,
	occupation varchar NULL,
	CONSTRAINT klien_siblings_data_pk PRIMARY KEY (sibling_number, user_id)
);
ALTER TABLE public.klien_siblings_data ADD CONSTRAINT klien_siblings_data_fk FOREIGN KEY (user_id) REFERENCES klien_data(user_id) ON UPDATE CASCADE ON DELETE CASCADE;

-- psikolog_data
CREATE TABLE public.psikolog_data (
	fullname varchar NULL,
	specialization varchar NULL,
	sip_number varchar NULL,
	str_number varchar NULL,
	ssp_number varchar NULL,
	user_id int4 NOT NULL,
	klien_username varchar NULL,
	gender bpchar(1) NULL,
	has_display_picture bool NOT NULL DEFAULT false,
	is_verified bool NOT NULL DEFAULT false,
	CONSTRAINT psikolog_data_pk PRIMARY KEY (user_id)
);

ALTER TABLE public.psikolog_data ADD CONSTRAINT psikolog_data_fk FOREIGN KEY (user_id) REFERENCES konselink_user(id) ON UPDATE CASCADE ON DELETE CASCADE;

-- psikolog_schedule
CREATE TABLE public.psikolog_schedule (
	psikolog_id int4 NOT NULL,
	klien_id int4 NULL,
	is_approved bool NOT NULL DEFAULT false,
	id serial NOT NULL,
	is_done bool NOT NULL DEFAULT false,
	start_times timestamptz NULL,
	end_times timestamptz NULL,
	CONSTRAINT psikolog_schedule_pk PRIMARY KEY (id)
);
CREATE INDEX psikolog_schedule_psikolog_id_idx ON public.psikolog_schedule USING btree (psikolog_id);
CREATE INDEX psikolog_schedule_psikolog_id_idx_2 ON public.psikolog_schedule USING btree (psikolog_id, start_times, end_times);
ALTER TABLE public.psikolog_schedule ADD CONSTRAINT psikolog_schedule_fk FOREIGN KEY (psikolog_id) REFERENCES konselink_user(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE public.psikolog_schedule ADD CONSTRAINT psikolog_schedule_fk_2 FOREIGN KEY (klien_id) REFERENCES konselink_user(id) ON DELETE SET NULL;

-- diagnosis_codes
CREATE TABLE public.diagnosis_codes (
	id serial NOT NULL,
	icd_9_cm varchar NOT NULL,
	icd_10_cm varchar NOT NULL,
	disorder varchar NULL,
	CONSTRAINT diagnosis_codes_pk PRIMARY KEY (id)
);
CREATE INDEX diagnosis_codes_disorder_idx ON public.diagnosis_codes USING btree (disorder);

-- klien_record
CREATE TABLE public.klien_record (
	id serial NOT NULL,
	schedule_id int4 NOT NULL,
	diagnosis varchar NULL,
	diagnosis_code int4 NULL,
	physical_health_history varchar NULL,
	medical_consumption varchar NULL,
	suicide_risk varchar NULL,
	self_harm_risk varchar NULL,
	others_harm_risk varchar NULL,
	assessment varchar NULL,
	consultation_purpose varchar NULL,
	treatment_plan varchar NULL,
	meetings int4 NULL,
	notes varchar NULL,
	CONSTRAINT klien_record_pk PRIMARY KEY (id)
);
ALTER TABLE public.klien_record ADD CONSTRAINT klien_record_fk FOREIGN KEY (schedule_id) REFERENCES psikolog_schedule(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE public.klien_record ADD CONSTRAINT klien_record_fk_3 FOREIGN KEY (diagnosis_code) REFERENCES diagnosis_codes(id) ON UPDATE CASCADE ON DELETE CASCADE;

-- preconsultation_survey
CREATE TABLE public.preconsultation_survey (
	id serial NOT NULL,
	answer_key varchar NOT NULL,
	answer_value int4 NOT NULL,
	schedule_id int4 NOT NULL,
	CONSTRAINT preconsultation_survey_pk PRIMARY KEY (id),
	CONSTRAINT preconsultation_survey_un UNIQUE (answer_key, schedule_id)
);
ALTER TABLE public.preconsultation_survey ADD CONSTRAINT preconsultation_survey_fk FOREIGN KEY (schedule_id) REFERENCES psikolog_schedule(id) ON UPDATE CASCADE ON DELETE CASCADE;

-- registration_survey
CREATE TABLE public.registration_survey (
	id serial NOT NULL,
	answer_key varchar NOT NULL,
	answer_value varchar NOT NULL,
	klien_id int4 NOT NULL,
	question_type varchar NOT NULL,
	CONSTRAINT registration_survey_pk PRIMARY KEY (id)
);
CREATE INDEX registration_survey_klien_id_idx ON public.registration_survey USING btree (klien_id);
ALTER TABLE public.registration_survey ADD CONSTRAINT registration_survey_fk FOREIGN KEY (klien_id) REFERENCES konselink_user(id) ON UPDATE CASCADE ON DELETE CASCADE;

-- konselink-chat
CREATE TABLE public.konselink_chat (
	id serial NOT NULL,
	message varchar NOT NULL,
	schedule_id int4 NOT NULL,
	sender_id int4 NOT NULL,
	"timestamp" timestamptz NOT NULL,
	CONSTRAINT konselink_chat_pk PRIMARY KEY (id)
);
ALTER TABLE public.konselink_chat ADD CONSTRAINT konselink_chat_fk FOREIGN KEY (schedule_id) REFERENCES psikolog_schedule(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE public.konselink_chat ADD CONSTRAINT konselink_chat_fk_1 FOREIGN KEY (sender_id) REFERENCES konselink_user(id);