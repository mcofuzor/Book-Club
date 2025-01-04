
-- Table: public.admin

-- DROP TABLE IF EXISTS public.admin;

CREATE TABLE IF NOT EXISTS public.admin
(
    id integer NOT NULL DEFAULT nextval('admin_id_seq'::regclass),
    username character varying(90) COLLATE pg_catalog."default" NOT NULL,
    userpass character varying(90) COLLATE pg_catalog."default" NOT NULL,
    firstname character varying(90) COLLATE pg_catalog."default",
    lastname character varying(90) COLLATE pg_catalog."default",
    usertype character varying(50) COLLATE pg_catalog."default",
    CONSTRAINT admin_pkey PRIMARY KEY (id),
    CONSTRAINT admin_username_key UNIQUE (username)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.admin
    OWNER to postgres;


-- Table: public.books

-- DROP TABLE IF EXISTS public.books;

CREATE TABLE IF NOT EXISTS public.books
(
    id integer NOT NULL DEFAULT nextval('books_id_seq'::regclass),
    title character varying(200) COLLATE pg_catalog."default" NOT NULL,
    rating integer NOT NULL,
    readdate date NOT NULL,
    userid integer,
    note character varying(10000) COLLATE pg_catalog."default",
    author character varying(90) COLLATE pg_catalog."default",
    summary character varying(1000) COLLATE pg_catalog."default",
    isbn character varying(50) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT books_pkey PRIMARY KEY (id),
    CONSTRAINT books_userid_fkey FOREIGN KEY (userid)
        REFERENCES public.admin (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.books
    OWNER to postgres;

=======
-- Table: public.admin

-- DROP TABLE IF EXISTS public.admin;

CREATE TABLE IF NOT EXISTS public.admin
(
    id integer NOT NULL DEFAULT nextval('admin_id_seq'::regclass),
    username character varying(90) COLLATE pg_catalog."default" NOT NULL,
    userpass character varying(90) COLLATE pg_catalog."default" NOT NULL,
    firstname character varying(90) COLLATE pg_catalog."default",
    lastname character varying(90) COLLATE pg_catalog."default",
    usertype character varying(50) COLLATE pg_catalog."default",
    CONSTRAINT admin_pkey PRIMARY KEY (id),
    CONSTRAINT admin_username_key UNIQUE (username)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.admin
    OWNER to postgres;


-- Table: public.books

-- DROP TABLE IF EXISTS public.books;

CREATE TABLE IF NOT EXISTS public.books
(
    id integer NOT NULL DEFAULT nextval('books_id_seq'::regclass),
    title character varying(200) COLLATE pg_catalog."default" NOT NULL,
    rating integer NOT NULL,
    readdate date NOT NULL,
    userid integer,
    note character varying(10000) COLLATE pg_catalog."default",
    author character varying(90) COLLATE pg_catalog."default",
    summary character varying(1000) COLLATE pg_catalog."default",
    isbn character varying(50) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT books_pkey PRIMARY KEY (id),
    CONSTRAINT books_userid_fkey FOREIGN KEY (userid)
        REFERENCES public.admin (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.books
    OWNER to postgres;


