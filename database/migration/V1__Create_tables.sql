CREATE TABLE sender
(
    user_id integer NOT NULL,
    first_name character varying COLLATE pg_catalog."default",
    last_name character varying COLLATE pg_catalog."default",
    username character varying COLLATE pg_catalog."default",
    is_banned boolean NOT NULL DEFAULT false,
    chat_id bigint NOT NULL,
    notify boolean NOT NULL DEFAULT false,
    CONSTRAINT sender_pkey PRIMARY KEY (user_id)
);

CREATE TABLE suggestion
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    file_id character varying COLLATE pg_catalog."default" NOT NULL,
    made_at timestamp with time zone NOT NULL,
    user_id integer NOT NULL,
    CONSTRAINT suggestion_pkey PRIMARY KEY (id)
);

CREATE TABLE review
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    suggestion_id integer NOT NULL,
    user_id integer NOT NULL,
    submitted_at timestamp with time zone NOT NULL,
    result_code integer NOT NULL,
    CONSTRAINT review_pkey PRIMARY KEY (id)
);