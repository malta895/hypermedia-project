--
-- PostgreSQL database dump
--

-- Dumped from database version 11.3
-- Dumped by pg_dump version 11.3

-- Started on 2019-07-04 17:11:04 CEST

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 7 (class 2615 OID 49411)
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA public;


--
-- TOC entry 233 (class 1255 OID 49446)
-- Name: create_cart(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.create_cart() RETURNS trigger
    LANGUAGE plpgsql
    AS $$BEGIN
INSERT INTO cart("user") VALUES(new.user_id);
RETURN NEW;
END;$$;


--
-- TOC entry 234 (class 1255 OID 49537)
-- Name: delete_cart_zero_quantity(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.delete_cart_zero_quantity() RETURNS trigger
    LANGUAGE plpgsql
    AS $$BEGIN
DELETE FROM cart_book WHERE cart_book.id = old.id;
RETURN NEW;
END$$;


--
-- TOC entry 235 (class 1255 OID 49599)
-- Name: update_average_rating_new(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_average_rating_new() RETURNS trigger
    LANGUAGE plpgsql
    AS $$    BEGIN

		update book set average_rating = (select avg(rating)
										  from review
										 	where book = new.book)
                WHERE book.book_id = new.book;
        RETURN NEW;
    END;
$$;


--
-- TOC entry 236 (class 1255 OID 49608)
-- Name: update_average_rating_old(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_average_rating_old() RETURNS trigger
    LANGUAGE plpgsql
    AS $$    BEGIN

		update book set average_rating = (select avg(rating)
										  from review
										 	where book = old.book)
                WHERE book.book_id = old.book;
        RETURN NEW;
    END;
$$;


--
-- TOC entry 237 (class 1255 OID 49703)
-- Name: update_cart_on_order(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_cart_on_order() RETURNS trigger
    LANGUAGE plpgsql
    AS $$BEGIN
UPDATE cart SET ordered = true
WHERE cart_id = new.cart;

INSERT INTO cart("user")
VALUES(new.user_id);

RETURN NEW;
END
$$;


SET default_tablespace = '';

SET default_with_oids = false;

--
-- TOC entry 197 (class 1259 OID 49415)
-- Name: address; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.address (
    address_id integer NOT NULL,
    first_name character varying(255),
    last_name character varying(255),
    street_line1 text NOT NULL,
    street_line2 text,
    city character varying(255) NOT NULL,
    zip_code character varying(255) NOT NULL,
    province character varying(255) NOT NULL,
    country character varying(255) NOT NULL
);


--
-- TOC entry 196 (class 1259 OID 49413)
-- Name: address_address_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.address_address_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3179 (class 0 OID 0)
-- Dependencies: 196
-- Name: address_address_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.address_address_id_seq OWNED BY public.address.address_id;


--
-- TOC entry 221 (class 1259 OID 49628)
-- Name: author; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.author (
    author_id integer NOT NULL,
    name character varying(255) NOT NULL,
    biography text,
    picture character varying(255)
);


--
-- TOC entry 220 (class 1259 OID 49626)
-- Name: author_author_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.author_author_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3180 (class 0 OID 0)
-- Dependencies: 220
-- Name: author_author_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.author_author_id_seq OWNED BY public.author.author_id;


--
-- TOC entry 223 (class 1259 OID 49639)
-- Name: author_book; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.author_book (
    id integer NOT NULL,
    book integer,
    author integer
);


--
-- TOC entry 222 (class 1259 OID 49637)
-- Name: author_book_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.author_book_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3181 (class 0 OID 0)
-- Dependencies: 222
-- Name: author_book_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.author_book_id_seq OWNED BY public.author_book.id;


--
-- TOC entry 228 (class 1259 OID 54628)
-- Name: author_essential; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.author_essential AS
 SELECT author.author_id,
    author.name,
    author.picture
   FROM public.author;


--
-- TOC entry 207 (class 1259 OID 49483)
-- Name: book; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.book (
    book_id integer NOT NULL,
    isbn character varying(15) NOT NULL,
    title text NOT NULL,
    price double precision NOT NULL,
    price_currency character varying(5),
    picture text NOT NULL,
    abstract text DEFAULT 'Lorem ipsum'::text NOT NULL,
    interview text,
    status text DEFAULT 'Available'::text,
    publisher integer,
    average_rating real,
    CONSTRAINT book_status_check CHECK ((status = ANY (ARRAY['Available'::text, 'Out of stock'::text])))
);


--
-- TOC entry 206 (class 1259 OID 49481)
-- Name: book_book_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.book_book_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3182 (class 0 OID 0)
-- Dependencies: 206
-- Name: book_book_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.book_book_id_seq OWNED BY public.book.book_id;


--
-- TOC entry 231 (class 1259 OID 54640)
-- Name: book_essentials; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.book_essentials AS
SELECT
    NULL::integer AS book_id,
    NULL::character varying(15) AS isbn,
    NULL::text AS title,
    NULL::double precision AS price,
    NULL::text AS picture,
    NULL::text AS abstract,
    NULL::text AS interview,
    NULL::text AS status,
    NULL::jsonb AS publisher,
    NULL::character varying[] AS genres,
    NULL::character varying[] AS themes,
    NULL::jsonb AS authors,
    NULL::real AS average_rating;


--
-- TOC entry 213 (class 1259 OID 49541)
-- Name: book_genre; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.book_genre (
    id integer NOT NULL,
    book integer NOT NULL,
    genre integer NOT NULL
);


--
-- TOC entry 212 (class 1259 OID 49539)
-- Name: book_genre_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.book_genre_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3183 (class 0 OID 0)
-- Dependencies: 212
-- Name: book_genre_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.book_genre_id_seq OWNED BY public.book_genre.id;


--
-- TOC entry 215 (class 1259 OID 49561)
-- Name: book_theme; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.book_theme (
    id integer NOT NULL,
    book integer NOT NULL,
    theme integer NOT NULL
);


--
-- TOC entry 214 (class 1259 OID 49559)
-- Name: book_theme_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.book_theme_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3184 (class 0 OID 0)
-- Dependencies: 214
-- Name: book_theme_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.book_theme_id_seq OWNED BY public.book_theme.id;


--
-- TOC entry 209 (class 1259 OID 49504)
-- Name: cart; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cart (
    cart_id integer NOT NULL,
    "user" integer NOT NULL,
    ordered boolean DEFAULT false NOT NULL
);


--
-- TOC entry 211 (class 1259 OID 49518)
-- Name: cart_book; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cart_book (
    id integer NOT NULL,
    cart integer NOT NULL,
    book integer NOT NULL,
    quantity integer DEFAULT 1 NOT NULL
);


--
-- TOC entry 210 (class 1259 OID 49516)
-- Name: cart_book_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.cart_book_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3185 (class 0 OID 0)
-- Dependencies: 210
-- Name: cart_book_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.cart_book_id_seq OWNED BY public.cart_book.id;


--
-- TOC entry 208 (class 1259 OID 49502)
-- Name: cart_cart_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.cart_cart_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3186 (class 0 OID 0)
-- Dependencies: 208
-- Name: cart_cart_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.cart_cart_id_seq OWNED BY public.cart.cart_id;


--
-- TOC entry 225 (class 1259 OID 49659)
-- Name: event; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.event (
    event_id integer NOT NULL,
    location integer,
    book integer,
    name character varying(255) NOT NULL,
    date_time timestamp with time zone NOT NULL
);


--
-- TOC entry 224 (class 1259 OID 49657)
-- Name: event_event_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.event_event_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3187 (class 0 OID 0)
-- Dependencies: 224
-- Name: event_event_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.event_event_id_seq OWNED BY public.event.event_id;


--
-- TOC entry 199 (class 1259 OID 49426)
-- Name: genre; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.genre (
    genre_id integer NOT NULL,
    name character varying(255) NOT NULL,
    description text
);


--
-- TOC entry 198 (class 1259 OID 49424)
-- Name: genre_genre_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.genre_genre_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3188 (class 0 OID 0)
-- Dependencies: 198
-- Name: genre_genre_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.genre_genre_id_seq OWNED BY public.genre.genre_id;


--
-- TOC entry 227 (class 1259 OID 49677)
-- Name: order; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."order" (
    order_id integer NOT NULL,
    user_id integer NOT NULL,
    shipment_address integer NOT NULL,
    shipping_method text,
    payment_method text,
    cart integer NOT NULL,
    order_date timestamp with time zone NOT NULL,
    CONSTRAINT order_payment_method_check CHECK ((payment_method = ANY (ARRAY['Credit Card'::text, 'PayPal'::text, 'Bank Transfer'::text, 'Cash on Delivery'::text]))),
    CONSTRAINT order_shipping_method_check CHECK ((shipping_method = ANY (ARRAY['Personal Pickup'::text, 'Delivery'::text])))
);


--
-- TOC entry 232 (class 1259 OID 54645)
-- Name: order_essentials; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.order_essentials AS
SELECT
    NULL::integer AS order_id,
    NULL::integer AS user_id,
    NULL::text AS payment_method,
    NULL::text AS shipping_method,
    NULL::jsonb AS shipment_address,
    NULL::double precision AS total_amount,
    NULL::jsonb AS books;


--
-- TOC entry 226 (class 1259 OID 49675)
-- Name: order_order_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.order_order_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3189 (class 0 OID 0)
-- Dependencies: 226
-- Name: order_order_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.order_order_id_seq OWNED BY public."order".order_id;


--
-- TOC entry 205 (class 1259 OID 49470)
-- Name: publisher; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.publisher (
    publisher_id integer NOT NULL,
    hq_location integer,
    name character varying(255) NOT NULL
);


--
-- TOC entry 229 (class 1259 OID 54632)
-- Name: publisher_complete; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.publisher_complete AS
 SELECT publisher.publisher_id,
    publisher.name,
    to_jsonb(ad.*) AS hq_address
   FROM (public.publisher
     LEFT JOIN public.address ad ON ((ad.address_id = publisher.hq_location)));


--
-- TOC entry 230 (class 1259 OID 54636)
-- Name: publisher_essential; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.publisher_essential AS
 SELECT publisher.publisher_id,
    publisher.name
   FROM public.publisher;


--
-- TOC entry 204 (class 1259 OID 49468)
-- Name: publisher_publisher_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.publisher_publisher_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3190 (class 0 OID 0)
-- Dependencies: 204
-- Name: publisher_publisher_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.publisher_publisher_id_seq OWNED BY public.publisher.publisher_id;


--
-- TOC entry 219 (class 1259 OID 49602)
-- Name: review; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.review (
    review_id integer NOT NULL,
    "user" integer NOT NULL,
    title character varying(255),
    text text,
    rating integer NOT NULL,
    book integer NOT NULL,
    date_published timestamp with time zone NOT NULL
);


--
-- TOC entry 218 (class 1259 OID 49600)
-- Name: review_review_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.review_review_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3191 (class 0 OID 0)
-- Dependencies: 218
-- Name: review_review_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.review_review_id_seq OWNED BY public.review.review_id;


--
-- TOC entry 217 (class 1259 OID 49581)
-- Name: similar_book; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.similar_book (
    id integer NOT NULL,
    book1 integer NOT NULL,
    book2 integer NOT NULL
);


--
-- TOC entry 216 (class 1259 OID 49579)
-- Name: similar_book_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.similar_book_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3192 (class 0 OID 0)
-- Dependencies: 216
-- Name: similar_book_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.similar_book_id_seq OWNED BY public.similar_book.id;


--
-- TOC entry 201 (class 1259 OID 49437)
-- Name: theme; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.theme (
    theme_id integer NOT NULL,
    name character varying(255) NOT NULL,
    description text
);


--
-- TOC entry 200 (class 1259 OID 49435)
-- Name: theme_theme_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.theme_theme_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3193 (class 0 OID 0)
-- Dependencies: 200
-- Name: theme_theme_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.theme_theme_id_seq OWNED BY public.theme.theme_id;


--
-- TOC entry 203 (class 1259 OID 49449)
-- Name: user; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."user" (
    user_id integer NOT NULL,
    username character varying(255),
    password character varying(255) NOT NULL,
    email character varying(255),
    first_name character varying(255) NOT NULL,
    surname character varying(255) NOT NULL,
    birth_date date NOT NULL,
    address integer,
    time_registered timestamp with time zone
);


--
-- TOC entry 202 (class 1259 OID 49447)
-- Name: user_user_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.user_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3194 (class 0 OID 0)
-- Dependencies: 202
-- Name: user_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.user_user_id_seq OWNED BY public."user".user_id;


--
-- TOC entry 2917 (class 2604 OID 49418)
-- Name: address address_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.address ALTER COLUMN address_id SET DEFAULT nextval('public.address_address_id_seq'::regclass);


--
-- TOC entry 2934 (class 2604 OID 49631)
-- Name: author author_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.author ALTER COLUMN author_id SET DEFAULT nextval('public.author_author_id_seq'::regclass);


--
-- TOC entry 2935 (class 2604 OID 49642)
-- Name: author_book id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.author_book ALTER COLUMN id SET DEFAULT nextval('public.author_book_id_seq'::regclass);


--
-- TOC entry 2922 (class 2604 OID 49486)
-- Name: book book_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.book ALTER COLUMN book_id SET DEFAULT nextval('public.book_book_id_seq'::regclass);


--
-- TOC entry 2930 (class 2604 OID 49544)
-- Name: book_genre id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.book_genre ALTER COLUMN id SET DEFAULT nextval('public.book_genre_id_seq'::regclass);


--
-- TOC entry 2931 (class 2604 OID 49564)
-- Name: book_theme id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.book_theme ALTER COLUMN id SET DEFAULT nextval('public.book_theme_id_seq'::regclass);


--
-- TOC entry 2926 (class 2604 OID 49507)
-- Name: cart cart_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cart ALTER COLUMN cart_id SET DEFAULT nextval('public.cart_cart_id_seq'::regclass);


--
-- TOC entry 2928 (class 2604 OID 49521)
-- Name: cart_book id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cart_book ALTER COLUMN id SET DEFAULT nextval('public.cart_book_id_seq'::regclass);


--
-- TOC entry 2936 (class 2604 OID 49662)
-- Name: event event_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.event ALTER COLUMN event_id SET DEFAULT nextval('public.event_event_id_seq'::regclass);


--
-- TOC entry 2918 (class 2604 OID 49429)
-- Name: genre genre_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.genre ALTER COLUMN genre_id SET DEFAULT nextval('public.genre_genre_id_seq'::regclass);


--
-- TOC entry 2937 (class 2604 OID 49680)
-- Name: order order_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."order" ALTER COLUMN order_id SET DEFAULT nextval('public.order_order_id_seq'::regclass);


--
-- TOC entry 2921 (class 2604 OID 49473)
-- Name: publisher publisher_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.publisher ALTER COLUMN publisher_id SET DEFAULT nextval('public.publisher_publisher_id_seq'::regclass);


--
-- TOC entry 2933 (class 2604 OID 49605)
-- Name: review review_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.review ALTER COLUMN review_id SET DEFAULT nextval('public.review_review_id_seq'::regclass);


--
-- TOC entry 2932 (class 2604 OID 49584)
-- Name: similar_book id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.similar_book ALTER COLUMN id SET DEFAULT nextval('public.similar_book_id_seq'::regclass);


--
-- TOC entry 2919 (class 2604 OID 49440)
-- Name: theme theme_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.theme ALTER COLUMN theme_id SET DEFAULT nextval('public.theme_theme_id_seq'::regclass);


--
-- TOC entry 2920 (class 2604 OID 49452)
-- Name: user user_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."user" ALTER COLUMN user_id SET DEFAULT nextval('public.user_user_id_seq'::regclass);


--
-- TOC entry 3143 (class 0 OID 49415)
-- Dependencies: 197
-- Data for Name: address; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.address (address_id, first_name, last_name, street_line1, street_line2, city, zip_code, province, country) VALUES (3, 'LUCA', 'MALTAGLIATI', 'VIA SALVO D''ACQUISTO 424', '', 'TAVERNERIO', '22038', 'CO', 'ITALY');
INSERT INTO public.address (address_id, first_name, last_name, street_line1, street_line2, city, zip_code, province, country) VALUES (7, 'LUCA', 'MALTAGLIATI', '', NULL, 'TAVERNERIO', '22038', 'CO', 'ITALY');
INSERT INTO public.address (address_id, first_name, last_name, street_line1, street_line2, city, zip_code, province, country) VALUES (8, 'LUCA', 'MALTAGLIATI', '', NULL, 'TAVERNERIO', '22038', 'CO', 'ITALY');
INSERT INTO public.address (address_id, first_name, last_name, street_line1, street_line2, city, zip_code, province, country) VALUES (9, 'LUCA', 'MALTAGLIATI', '', NULL, 'TAVERNERIO', '22038', 'CO', 'ITALY');
INSERT INTO public.address (address_id, first_name, last_name, street_line1, street_line2, city, zip_code, province, country) VALUES (10, 'LUCA', 'MALTAGLIATI', '', NULL, 'TAVERNERIO', '22038', 'CO', 'ITALY');


--
-- TOC entry 3167 (class 0 OID 49628)
-- Dependencies: 221
-- Data for Name: author; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.author (author_id, name, biography, picture) VALUES (1874, 'Suzanne Collins', NULL, NULL);
INSERT INTO public.author (author_id, name, biography, picture) VALUES (1875, 'J.R.R. Tolkien', NULL, NULL);
INSERT INTO public.author (author_id, name, biography, picture) VALUES (1876, 'Dan Brown', NULL, NULL);
INSERT INTO public.author (author_id, name, biography, picture) VALUES (1877, 'J.K. Rowling', NULL, NULL);
INSERT INTO public.author (author_id, name, biography, picture) VALUES (1878, ' Mary GrandPré', NULL, NULL);
INSERT INTO public.author (author_id, name, biography, picture) VALUES (1879, 'George R.R. Martin', NULL, NULL);
INSERT INTO public.author (author_id, name, biography, picture) VALUES (1880, 'Christopher Paolini', NULL, NULL);
INSERT INTO public.author (author_id, name, biography, picture) VALUES (1881, 'Robert Galbraith', NULL, NULL);
INSERT INTO public.author (author_id, name, biography, picture) VALUES (1882, ' J.K. Rowling', NULL, NULL);
INSERT INTO public.author (author_id, name, biography, picture) VALUES (1883, ' Christopher Tolkien', NULL, NULL);
INSERT INTO public.author (author_id, name, biography, picture) VALUES (1884, ' Ted Nasmith', NULL, NULL);
INSERT INTO public.author (author_id, name, biography, picture) VALUES (1885, 'Chuck Dixon', NULL, NULL);
INSERT INTO public.author (author_id, name, biography, picture) VALUES (1886, ' J.R.R. Tolkien', NULL, NULL);
INSERT INTO public.author (author_id, name, biography, picture) VALUES (1887, ' David Wenzel', NULL, NULL);
INSERT INTO public.author (author_id, name, biography, picture) VALUES (1888, ' Sean Deming', NULL, NULL);
INSERT INTO public.author (author_id, name, biography, picture) VALUES (1889, 'Kennilworthy Whisp', NULL, NULL);
INSERT INTO public.author (author_id, name, biography, picture) VALUES (1890, ' Gary Gianni', NULL, NULL);
INSERT INTO public.author (author_id, name, biography, picture) VALUES (1891, 'Ben Avery', NULL, NULL);
INSERT INTO public.author (author_id, name, biography, picture) VALUES (1892, ' Mike S. Miller', NULL, NULL);
INSERT INTO public.author (author_id, name, biography, picture) VALUES (1893, ' George R.R. Martin', NULL, NULL);
INSERT INTO public.author (author_id, name, biography, picture) VALUES (1894, ' Elio M. García Jr.', NULL, NULL);
INSERT INTO public.author (author_id, name, biography, picture) VALUES (1895, ' Linda Antonsson', NULL, NULL);


--
-- TOC entry 3169 (class 0 OID 49639)
-- Dependencies: 223
-- Data for Name: author_book; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.author_book (id, book, author) VALUES (2257, 0, 1874);
INSERT INTO public.author_book (id, book, author) VALUES (2258, 1, 1875);
INSERT INTO public.author_book (id, book, author) VALUES (2259, 2, 1876);
INSERT INTO public.author_book (id, book, author) VALUES (2260, 3, 1874);
INSERT INTO public.author_book (id, book, author) VALUES (2261, 4, 1874);
INSERT INTO public.author_book (id, book, author) VALUES (2262, 5, 1877);
INSERT INTO public.author_book (id, book, author) VALUES (2263, 5, 1878);
INSERT INTO public.author_book (id, book, author) VALUES (2264, 6, 1877);
INSERT INTO public.author_book (id, book, author) VALUES (2265, 6, 1878);
INSERT INTO public.author_book (id, book, author) VALUES (2266, 7, 1875);
INSERT INTO public.author_book (id, book, author) VALUES (2267, 8, 1876);
INSERT INTO public.author_book (id, book, author) VALUES (2268, 9, 1879);
INSERT INTO public.author_book (id, book, author) VALUES (2269, 10, 1880);
INSERT INTO public.author_book (id, book, author) VALUES (2270, 11, 1879);
INSERT INTO public.author_book (id, book, author) VALUES (2271, 12, 1875);
INSERT INTO public.author_book (id, book, author) VALUES (2272, 13, 1879);
INSERT INTO public.author_book (id, book, author) VALUES (2273, 14, 1875);
INSERT INTO public.author_book (id, book, author) VALUES (2274, 15, 1879);
INSERT INTO public.author_book (id, book, author) VALUES (2275, 16, 1876);
INSERT INTO public.author_book (id, book, author) VALUES (2276, 17, 1875);
INSERT INTO public.author_book (id, book, author) VALUES (2277, 18, 1879);
INSERT INTO public.author_book (id, book, author) VALUES (2278, 19, 1876);
INSERT INTO public.author_book (id, book, author) VALUES (2279, 20, 1876);
INSERT INTO public.author_book (id, book, author) VALUES (2280, 21, 1881);
INSERT INTO public.author_book (id, book, author) VALUES (2281, 21, 1882);
INSERT INTO public.author_book (id, book, author) VALUES (2282, 22, 1877);
INSERT INTO public.author_book (id, book, author) VALUES (2283, 23, 1880);
INSERT INTO public.author_book (id, book, author) VALUES (2284, 24, 1877);
INSERT INTO public.author_book (id, book, author) VALUES (2285, 25, 1877);
INSERT INTO public.author_book (id, book, author) VALUES (2286, 26, 1875);
INSERT INTO public.author_book (id, book, author) VALUES (2287, 26, 1883);
INSERT INTO public.author_book (id, book, author) VALUES (2288, 26, 1884);
INSERT INTO public.author_book (id, book, author) VALUES (2289, 27, 1874);
INSERT INTO public.author_book (id, book, author) VALUES (2290, 28, 1885);
INSERT INTO public.author_book (id, book, author) VALUES (2291, 28, 1886);
INSERT INTO public.author_book (id, book, author) VALUES (2292, 28, 1887);
INSERT INTO public.author_book (id, book, author) VALUES (2293, 28, 1888);
INSERT INTO public.author_book (id, book, author) VALUES (2294, 29, 1881);
INSERT INTO public.author_book (id, book, author) VALUES (2295, 29, 1882);
INSERT INTO public.author_book (id, book, author) VALUES (2296, 30, 1889);
INSERT INTO public.author_book (id, book, author) VALUES (2297, 30, 1882);
INSERT INTO public.author_book (id, book, author) VALUES (2298, 31, 1875);
INSERT INTO public.author_book (id, book, author) VALUES (2299, 32, 1879);
INSERT INTO public.author_book (id, book, author) VALUES (2300, 33, 1874);
INSERT INTO public.author_book (id, book, author) VALUES (2301, 34, 1874);
INSERT INTO public.author_book (id, book, author) VALUES (2302, 35, 1879);
INSERT INTO public.author_book (id, book, author) VALUES (2303, 35, 1890);
INSERT INTO public.author_book (id, book, author) VALUES (2304, 36, 1874);
INSERT INTO public.author_book (id, book, author) VALUES (2305, 37, 1891);
INSERT INTO public.author_book (id, book, author) VALUES (2306, 37, 1892);
INSERT INTO public.author_book (id, book, author) VALUES (2307, 37, 1893);
INSERT INTO public.author_book (id, book, author) VALUES (2308, 38, 1879);
INSERT INTO public.author_book (id, book, author) VALUES (2309, 38, 1894);
INSERT INTO public.author_book (id, book, author) VALUES (2310, 38, 1895);


--
-- TOC entry 3153 (class 0 OID 49483)
-- Dependencies: 207
-- Data for Name: book; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.book (book_id, isbn, title, price, price_currency, picture, abstract, interview, status, publisher, average_rating) VALUES (0, '439023483', 'The Hunger Games', 19, NULL, 'https://images.gr-assets.com/books/1447303603l/2767052.jpg', 'Lorem ipsum', NULL, 'Available', 319, NULL);
INSERT INTO public.book (book_id, isbn, title, price, price_currency, picture, abstract, interview, status, publisher, average_rating) VALUES (1, '618260307', 'The Hobbit or There and Back Again', 12, NULL, 'https://images.gr-assets.com/books/1372847500l/5907.jpg', 'Lorem ipsum', NULL, 'Available', 320, NULL);
INSERT INTO public.book (book_id, isbn, title, price, price_currency, picture, abstract, interview, status, publisher, average_rating) VALUES (2, '1416524797', 'Angels & Demons ', 40, NULL, 'https://images.gr-assets.com/books/1303390735l/960.jpg', 'Lorem ipsum', NULL, 'Available', 321, NULL);
INSERT INTO public.book (book_id, isbn, title, price, price_currency, picture, abstract, interview, status, publisher, average_rating) VALUES (3, '439023491', 'Catching Fire', 33, NULL, 'https://images.gr-assets.com/books/1358273780l/6148028.jpg', 'Lorem ipsum', NULL, 'Available', 322, NULL);
INSERT INTO public.book (book_id, isbn, title, price, price_currency, picture, abstract, interview, status, publisher, average_rating) VALUES (4, '439023513', 'Mockingjay', 36, NULL, 'https://images.gr-assets.com/books/1358275419l/7260188.jpg', 'Lorem ipsum', NULL, 'Available', 317, NULL);
INSERT INTO public.book (book_id, isbn, title, price, price_currency, picture, abstract, interview, status, publisher, average_rating) VALUES (5, '439139600', 'Harry Potter and the Goblet of Fire', 23, NULL, 'https://images.gr-assets.com/books/1361482611l/6.jpg', 'Lorem ipsum', NULL, 'Available', 317, NULL);
INSERT INTO public.book (book_id, isbn, title, price, price_currency, picture, abstract, interview, status, publisher, average_rating) VALUES (6, '545010225', 'Harry Potter and the Deathly Hallows', 23, NULL, 'https://images.gr-assets.com/books/1474171184l/136251.jpg', 'Lorem ipsum', NULL, 'Available', 319, NULL);
INSERT INTO public.book (book_id, isbn, title, price, price_currency, picture, abstract, interview, status, publisher, average_rating) VALUES (7, '618346252', ' The Fellowship of the Ring', 24, NULL, 'https://images.gr-assets.com/books/1298411339l/34.jpg', 'Lorem ipsum', NULL, 'Available', 317, NULL);
INSERT INTO public.book (book_id, isbn, title, price, price_currency, picture, abstract, interview, status, publisher, average_rating) VALUES (8, '307277674', 'The Da Vinci Code', 44, NULL, 'https://images.gr-assets.com/books/1303252999l/968.jpg', 'Lorem ipsum', NULL, 'Available', 322, NULL);
INSERT INTO public.book (book_id, isbn, title, price, price_currency, picture, abstract, interview, status, publisher, average_rating) VALUES (9, '553588486', 'A Game of Thrones', 12, NULL, 'https://images.gr-assets.com/books/1436732693l/13496.jpg', 'Lorem ipsum', NULL, 'Available', 319, NULL);
INSERT INTO public.book (book_id, isbn, title, price, price_currency, picture, abstract, interview, status, publisher, average_rating) VALUES (10, '375826696', 'Eragon', 49, NULL, 'https://images.gr-assets.com/books/1366212852l/113436.jpg', 'Lorem ipsum', NULL, 'Available', 317, NULL);
INSERT INTO public.book (book_id, isbn, title, price, price_currency, picture, abstract, interview, status, publisher, average_rating) VALUES (11, '553381695', 'A Clash of Kings', 45, NULL, 'https://images.gr-assets.com/books/1358254974l/10572.jpg', 'Lorem ipsum', NULL, 'Available', 322, NULL);
INSERT INTO public.book (book_id, isbn, title, price, price_currency, picture, abstract, interview, status, publisher, average_rating) VALUES (12, '618346260', 'The Two Towers', 42, NULL, 'https://images.gr-assets.com/books/1298415523l/15241.jpg', 'Lorem ipsum', NULL, 'Available', 322, NULL);
INSERT INTO public.book (book_id, isbn, title, price, price_currency, picture, abstract, interview, status, publisher, average_rating) VALUES (13, '055357342X', 'A Storm of Swords', 48, NULL, 'https://images.gr-assets.com/books/1497931121l/62291.jpg', 'Lorem ipsum', NULL, 'Available', 316, NULL);
INSERT INTO public.book (book_id, isbn, title, price, price_currency, picture, abstract, interview, status, publisher, average_rating) VALUES (14, '345339738', 'The Return of the King', 15, NULL, 'https://images.gr-assets.com/books/1389977161l/18512.jpg', 'Lorem ipsum', NULL, 'Available', 320, NULL);
INSERT INTO public.book (book_id, isbn, title, price, price_currency, picture, abstract, interview, status, publisher, average_rating) VALUES (15, '055358202X', 'A Feast for Crows', 13, NULL, 'https://images.gr-assets.com/books/1429538615l/13497.jpg', 'Lorem ipsum', NULL, 'Available', 316, NULL);
INSERT INTO public.book (book_id, isbn, title, price, price_currency, picture, abstract, interview, status, publisher, average_rating) VALUES (16, '552151696', 'Digital Fortress', 46, NULL, 'https://images.gr-assets.com/books/1360095966l/11125.jpg', 'Lorem ipsum', NULL, 'Available', 318, NULL);
INSERT INTO public.book (book_id, isbn, title, price, price_currency, picture, abstract, interview, status, publisher, average_rating) VALUES (17, '618640150', 'The Lord of the Rings', 9, NULL, 'https://images.gr-assets.com/books/1411114164l/33.jpg', 'Lorem ipsum', NULL, 'Available', 319, NULL);
INSERT INTO public.book (book_id, isbn, title, price, price_currency, picture, abstract, interview, status, publisher, average_rating) VALUES (18, 'nan', 'A Dance with Dragons', 49, NULL, 'https://images.gr-assets.com/books/1327885335l/10664113.jpg', 'Lorem ipsum', NULL, 'Available', 319, NULL);
INSERT INTO public.book (book_id, isbn, title, price, price_currency, picture, abstract, interview, status, publisher, average_rating) VALUES (19, '385504225', 'The Lost Symbol', 22, NULL, 'https://images.gr-assets.com/books/1358274396l/6411961.jpg', 'Lorem ipsum', NULL, 'Available', 321, NULL);
INSERT INTO public.book (book_id, isbn, title, price, price_currency, picture, abstract, interview, status, publisher, average_rating) VALUES (20, '385537859', 'Inferno', 10, NULL, 'https://images.gr-assets.com/books/1397093185l/17212231.jpg', 'Lorem ipsum', NULL, 'Available', 316, NULL);
INSERT INTO public.book (book_id, isbn, title, price, price_currency, picture, abstract, interview, status, publisher, average_rating) VALUES (21, '316206849', 'The Cuckoo''s Calling', 42, NULL, 'https://images.gr-assets.com/books/1358716559l/16160797.jpg', 'Lorem ipsum', NULL, 'Available', 319, NULL);
INSERT INTO public.book (book_id, isbn, title, price, price_currency, picture, abstract, interview, status, publisher, average_rating) VALUES (22, '747599874', 'The Tales of Beedle the Bard', 31, NULL, 'https://images.gr-assets.com/books/1373467575l/3950967.jpg', 'Lorem ipsum', NULL, 'Available', 320, NULL);
INSERT INTO public.book (book_id, isbn, title, price, price_currency, picture, abstract, interview, status, publisher, average_rating) VALUES (23, '375840400', 'Eldest', 43, NULL, 'https://images.gr-assets.com/books/1387119654l/45978.jpg', 'Lorem ipsum', NULL, 'Available', 322, NULL);
INSERT INTO public.book (book_id, isbn, title, price, price_currency, picture, abstract, interview, status, publisher, average_rating) VALUES (24, '316228532', 'The Casual Vacancy', 10, NULL, 'https://images.gr-assets.com/books/1358266832l/13497818.jpg', 'Lorem ipsum', NULL, 'Available', 321, NULL);
INSERT INTO public.book (book_id, isbn, title, price, price_currency, picture, abstract, interview, status, publisher, average_rating) VALUES (25, '545044251', 'Complete Harry Potter Boxed Set', 30, NULL, 'https://images.gr-assets.com/books/1392579059l/862041.jpg', 'Lorem ipsum', NULL, 'Available', 321, NULL);
INSERT INTO public.book (book_id, isbn, title, price, price_currency, picture, abstract, interview, status, publisher, average_rating) VALUES (26, '618391118', 'The Silmarillion', 21, NULL, 'https://images.gr-assets.com/books/1336502583l/7332.jpg', 'Lorem ipsum', NULL, 'Available', 318, NULL);
INSERT INTO public.book (book_id, isbn, title, price, price_currency, picture, abstract, interview, status, publisher, average_rating) VALUES (27, '545265355', 'The Hunger Games Box Set', 30, NULL, 'https://images.gr-assets.com/books/1360094673l/7938275.jpg', 'Lorem ipsum', NULL, 'Available', 320, NULL);
INSERT INTO public.book (book_id, isbn, title, price, price_currency, picture, abstract, interview, status, publisher, average_rating) VALUES (28, '345368584', 'The Hobbit', 34, NULL, 'https://images.gr-assets.com/books/1374681632l/659469.jpg', 'Lorem ipsum', NULL, 'Available', 319, NULL);
INSERT INTO public.book (book_id, isbn, title, price, price_currency, picture, abstract, interview, status, publisher, average_rating) VALUES (29, '316206873', 'The Silkworm', 23, NULL, 'https://images.gr-assets.com/books/1392577290l/18214414.jpg', 'Lorem ipsum', NULL, 'Available', 319, NULL);
INSERT INTO public.book (book_id, isbn, title, price, price_currency, picture, abstract, interview, status, publisher, average_rating) VALUES (30, '439321611', 'Quidditch Through the Ages', 48, NULL, 'https://images.gr-assets.com/books/1369689506l/111450.jpg', 'Lorem ipsum', NULL, 'Available', 321, NULL);
INSERT INTO public.book (book_id, isbn, title, price, price_currency, picture, abstract, interview, status, publisher, average_rating) VALUES (31, '345538374', 'The Hobbit and The Lord of the Rings', 31, NULL, 'https://images.gr-assets.com/books/1346072396l/30.jpg', 'Lorem ipsum', NULL, 'Available', 320, NULL);
INSERT INTO public.book (book_id, isbn, title, price, price_currency, picture, abstract, interview, status, publisher, average_rating) VALUES (32, '1780484259', 'A Song of Ice and Fire', 16, NULL, 'https://images.gr-assets.com/books/1339340118l/12177850.jpg', 'Lorem ipsum', NULL, 'Available', 320, NULL);
INSERT INTO public.book (book_id, isbn, title, price, price_currency, picture, abstract, interview, status, publisher, average_rating) VALUES (33, '043979143X', 'Gregor and the Code of Claw', 46, NULL, 'https://images.gr-assets.com/books/1365854331l/537070.jpg', 'Lorem ipsum', NULL, 'Available', 319, NULL);
INSERT INTO public.book (book_id, isbn, title, price, price_currency, picture, abstract, interview, status, publisher, average_rating) VALUES (34, '439650763', 'Gregor and the Prophecy of Bane', 34, NULL, 'https://images.gr-assets.com/books/1337457481l/385742.jpg', 'Lorem ipsum', NULL, 'Available', 316, NULL);
INSERT INTO public.book (book_id, isbn, title, price, price_currency, picture, abstract, interview, status, publisher, average_rating) VALUES (35, '345533488', 'A Knight of the Seven Kingdoms', 20, NULL, 'https://images.gr-assets.com/books/1423281810l/18635622.jpg', 'Lorem ipsum', NULL, 'Available', 318, NULL);
INSERT INTO public.book (book_id, isbn, title, price, price_currency, picture, abstract, interview, status, publisher, average_rating) VALUES (36, '439791464', 'Gregor and the Marks of Secret', 29, NULL, 'https://images.gr-assets.com/books/1397854344l/319644.jpg', 'Lorem ipsum', NULL, 'Available', 316, NULL);
INSERT INTO public.book (book_id, isbn, title, price, price_currency, picture, abstract, interview, status, publisher, average_rating) VALUES (37, '097640110X', 'The Hedge Knight', 28, NULL, 'https://images.gr-assets.com/books/1443806558l/13501.jpg', 'Lorem ipsum', NULL, 'Available', 322, NULL);
INSERT INTO public.book (book_id, isbn, title, price, price_currency, picture, abstract, interview, status, publisher, average_rating) VALUES (38, '553805444', 'The World of Ice and Fire', 44, NULL, 'https://images.gr-assets.com/books/1400360220l/17345242.jpg', 'Lorem ipsum', NULL, 'Available', 318, NULL);


--
-- TOC entry 3159 (class 0 OID 49541)
-- Dependencies: 213
-- Data for Name: book_genre; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.book_genre (id, book, genre) VALUES (3282, 0, 500);
INSERT INTO public.book_genre (id, book, genre) VALUES (3283, 0, 499);
INSERT INTO public.book_genre (id, book, genre) VALUES (3284, 0, 502);
INSERT INTO public.book_genre (id, book, genre) VALUES (3285, 1, 506);
INSERT INTO public.book_genre (id, book, genre) VALUES (3286, 2, 505);
INSERT INTO public.book_genre (id, book, genre) VALUES (3287, 2, 496);
INSERT INTO public.book_genre (id, book, genre) VALUES (3288, 2, 499);
INSERT INTO public.book_genre (id, book, genre) VALUES (3289, 3, 503);
INSERT INTO public.book_genre (id, book, genre) VALUES (3290, 3, 499);
INSERT INTO public.book_genre (id, book, genre) VALUES (3291, 3, 502);
INSERT INTO public.book_genre (id, book, genre) VALUES (3292, 4, 505);
INSERT INTO public.book_genre (id, book, genre) VALUES (3293, 4, 498);
INSERT INTO public.book_genre (id, book, genre) VALUES (3294, 4, 502);
INSERT INTO public.book_genre (id, book, genre) VALUES (3295, 5, 499);
INSERT INTO public.book_genre (id, book, genre) VALUES (3296, 5, 505);
INSERT INTO public.book_genre (id, book, genre) VALUES (3297, 5, 500);
INSERT INTO public.book_genre (id, book, genre) VALUES (3298, 6, 499);
INSERT INTO public.book_genre (id, book, genre) VALUES (3299, 7, 497);
INSERT INTO public.book_genre (id, book, genre) VALUES (3300, 8, 501);
INSERT INTO public.book_genre (id, book, genre) VALUES (3301, 8, 505);
INSERT INTO public.book_genre (id, book, genre) VALUES (3302, 9, 500);
INSERT INTO public.book_genre (id, book, genre) VALUES (3303, 10, 504);
INSERT INTO public.book_genre (id, book, genre) VALUES (3304, 10, 496);
INSERT INTO public.book_genre (id, book, genre) VALUES (3305, 11, 496);
INSERT INTO public.book_genre (id, book, genre) VALUES (3306, 12, 505);
INSERT INTO public.book_genre (id, book, genre) VALUES (3307, 12, 496);
INSERT INTO public.book_genre (id, book, genre) VALUES (3308, 13, 502);
INSERT INTO public.book_genre (id, book, genre) VALUES (3309, 14, 502);
INSERT INTO public.book_genre (id, book, genre) VALUES (3310, 14, 506);
INSERT INTO public.book_genre (id, book, genre) VALUES (3311, 15, 502);
INSERT INTO public.book_genre (id, book, genre) VALUES (3312, 16, 506);
INSERT INTO public.book_genre (id, book, genre) VALUES (3313, 16, 497);
INSERT INTO public.book_genre (id, book, genre) VALUES (3314, 16, 500);
INSERT INTO public.book_genre (id, book, genre) VALUES (3315, 17, 505);
INSERT INTO public.book_genre (id, book, genre) VALUES (3316, 17, 503);
INSERT INTO public.book_genre (id, book, genre) VALUES (3317, 17, 500);
INSERT INTO public.book_genre (id, book, genre) VALUES (3318, 18, 504);
INSERT INTO public.book_genre (id, book, genre) VALUES (3319, 19, 502);
INSERT INTO public.book_genre (id, book, genre) VALUES (3320, 20, 503);
INSERT INTO public.book_genre (id, book, genre) VALUES (3321, 20, 505);
INSERT INTO public.book_genre (id, book, genre) VALUES (3322, 21, 501);
INSERT INTO public.book_genre (id, book, genre) VALUES (3323, 21, 505);
INSERT INTO public.book_genre (id, book, genre) VALUES (3324, 22, 501);
INSERT INTO public.book_genre (id, book, genre) VALUES (3325, 23, 496);
INSERT INTO public.book_genre (id, book, genre) VALUES (3326, 23, 499);
INSERT INTO public.book_genre (id, book, genre) VALUES (3327, 23, 498);
INSERT INTO public.book_genre (id, book, genre) VALUES (3328, 24, 499);
INSERT INTO public.book_genre (id, book, genre) VALUES (3329, 24, 503);
INSERT INTO public.book_genre (id, book, genre) VALUES (3330, 25, 505);
INSERT INTO public.book_genre (id, book, genre) VALUES (3331, 26, 496);
INSERT INTO public.book_genre (id, book, genre) VALUES (3332, 26, 498);
INSERT INTO public.book_genre (id, book, genre) VALUES (3333, 26, 502);
INSERT INTO public.book_genre (id, book, genre) VALUES (3334, 27, 497);
INSERT INTO public.book_genre (id, book, genre) VALUES (3335, 28, 498);
INSERT INTO public.book_genre (id, book, genre) VALUES (3336, 29, 505);
INSERT INTO public.book_genre (id, book, genre) VALUES (3337, 30, 504);
INSERT INTO public.book_genre (id, book, genre) VALUES (3338, 30, 506);
INSERT INTO public.book_genre (id, book, genre) VALUES (3339, 30, 498);
INSERT INTO public.book_genre (id, book, genre) VALUES (3340, 31, 500);
INSERT INTO public.book_genre (id, book, genre) VALUES (3341, 31, 501);
INSERT INTO public.book_genre (id, book, genre) VALUES (3342, 32, 504);
INSERT INTO public.book_genre (id, book, genre) VALUES (3343, 32, 506);
INSERT INTO public.book_genre (id, book, genre) VALUES (3344, 32, 496);
INSERT INTO public.book_genre (id, book, genre) VALUES (3345, 33, 505);
INSERT INTO public.book_genre (id, book, genre) VALUES (3346, 33, 501);
INSERT INTO public.book_genre (id, book, genre) VALUES (3347, 33, 496);
INSERT INTO public.book_genre (id, book, genre) VALUES (3348, 34, 506);
INSERT INTO public.book_genre (id, book, genre) VALUES (3349, 34, 503);
INSERT INTO public.book_genre (id, book, genre) VALUES (3350, 35, 498);
INSERT INTO public.book_genre (id, book, genre) VALUES (3351, 35, 506);
INSERT INTO public.book_genre (id, book, genre) VALUES (3352, 35, 505);
INSERT INTO public.book_genre (id, book, genre) VALUES (3353, 36, 499);
INSERT INTO public.book_genre (id, book, genre) VALUES (3354, 36, 496);
INSERT INTO public.book_genre (id, book, genre) VALUES (3355, 37, 502);
INSERT INTO public.book_genre (id, book, genre) VALUES (3356, 38, 500);
INSERT INTO public.book_genre (id, book, genre) VALUES (3357, 38, 503);


--
-- TOC entry 3161 (class 0 OID 49561)
-- Dependencies: 215
-- Data for Name: book_theme; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.book_theme (id, book, theme) VALUES (3347, 0, 552);
INSERT INTO public.book_theme (id, book, theme) VALUES (3348, 0, 548);
INSERT INTO public.book_theme (id, book, theme) VALUES (3349, 1, 543);
INSERT INTO public.book_theme (id, book, theme) VALUES (3350, 2, 547);
INSERT INTO public.book_theme (id, book, theme) VALUES (3351, 2, 552);
INSERT INTO public.book_theme (id, book, theme) VALUES (3352, 3, 550);
INSERT INTO public.book_theme (id, book, theme) VALUES (3353, 3, 551);
INSERT INTO public.book_theme (id, book, theme) VALUES (3354, 3, 545);
INSERT INTO public.book_theme (id, book, theme) VALUES (3355, 4, 544);
INSERT INTO public.book_theme (id, book, theme) VALUES (3356, 4, 542);
INSERT INTO public.book_theme (id, book, theme) VALUES (3357, 4, 549);
INSERT INTO public.book_theme (id, book, theme) VALUES (3358, 5, 548);
INSERT INTO public.book_theme (id, book, theme) VALUES (3359, 5, 545);
INSERT INTO public.book_theme (id, book, theme) VALUES (3360, 6, 549);
INSERT INTO public.book_theme (id, book, theme) VALUES (3361, 7, 550);
INSERT INTO public.book_theme (id, book, theme) VALUES (3362, 8, 542);
INSERT INTO public.book_theme (id, book, theme) VALUES (3363, 8, 544);
INSERT INTO public.book_theme (id, book, theme) VALUES (3364, 8, 551);
INSERT INTO public.book_theme (id, book, theme) VALUES (3365, 9, 546);
INSERT INTO public.book_theme (id, book, theme) VALUES (3366, 9, 545);
INSERT INTO public.book_theme (id, book, theme) VALUES (3367, 10, 546);
INSERT INTO public.book_theme (id, book, theme) VALUES (3368, 11, 546);
INSERT INTO public.book_theme (id, book, theme) VALUES (3369, 12, 552);
INSERT INTO public.book_theme (id, book, theme) VALUES (3370, 13, 541);
INSERT INTO public.book_theme (id, book, theme) VALUES (3371, 14, 550);
INSERT INTO public.book_theme (id, book, theme) VALUES (3372, 15, 547);
INSERT INTO public.book_theme (id, book, theme) VALUES (3373, 15, 549);
INSERT INTO public.book_theme (id, book, theme) VALUES (3374, 15, 545);
INSERT INTO public.book_theme (id, book, theme) VALUES (3375, 16, 544);
INSERT INTO public.book_theme (id, book, theme) VALUES (3376, 16, 542);
INSERT INTO public.book_theme (id, book, theme) VALUES (3377, 16, 552);
INSERT INTO public.book_theme (id, book, theme) VALUES (3378, 17, 546);
INSERT INTO public.book_theme (id, book, theme) VALUES (3379, 18, 551);
INSERT INTO public.book_theme (id, book, theme) VALUES (3380, 19, 546);
INSERT INTO public.book_theme (id, book, theme) VALUES (3381, 19, 541);
INSERT INTO public.book_theme (id, book, theme) VALUES (3382, 20, 541);
INSERT INTO public.book_theme (id, book, theme) VALUES (3383, 20, 552);
INSERT INTO public.book_theme (id, book, theme) VALUES (3384, 21, 544);
INSERT INTO public.book_theme (id, book, theme) VALUES (3385, 21, 545);
INSERT INTO public.book_theme (id, book, theme) VALUES (3386, 22, 544);
INSERT INTO public.book_theme (id, book, theme) VALUES (3387, 22, 542);
INSERT INTO public.book_theme (id, book, theme) VALUES (3388, 23, 547);
INSERT INTO public.book_theme (id, book, theme) VALUES (3389, 24, 552);
INSERT INTO public.book_theme (id, book, theme) VALUES (3390, 25, 544);
INSERT INTO public.book_theme (id, book, theme) VALUES (3391, 26, 551);
INSERT INTO public.book_theme (id, book, theme) VALUES (3392, 26, 552);
INSERT INTO public.book_theme (id, book, theme) VALUES (3393, 27, 541);
INSERT INTO public.book_theme (id, book, theme) VALUES (3394, 27, 551);
INSERT INTO public.book_theme (id, book, theme) VALUES (3395, 27, 543);
INSERT INTO public.book_theme (id, book, theme) VALUES (3396, 28, 547);
INSERT INTO public.book_theme (id, book, theme) VALUES (3397, 29, 547);
INSERT INTO public.book_theme (id, book, theme) VALUES (3398, 29, 545);
INSERT INTO public.book_theme (id, book, theme) VALUES (3399, 30, 542);
INSERT INTO public.book_theme (id, book, theme) VALUES (3400, 30, 548);
INSERT INTO public.book_theme (id, book, theme) VALUES (3401, 30, 543);
INSERT INTO public.book_theme (id, book, theme) VALUES (3402, 31, 541);
INSERT INTO public.book_theme (id, book, theme) VALUES (3403, 31, 551);
INSERT INTO public.book_theme (id, book, theme) VALUES (3404, 31, 542);
INSERT INTO public.book_theme (id, book, theme) VALUES (3405, 32, 546);
INSERT INTO public.book_theme (id, book, theme) VALUES (3406, 33, 544);
INSERT INTO public.book_theme (id, book, theme) VALUES (3407, 33, 547);
INSERT INTO public.book_theme (id, book, theme) VALUES (3408, 33, 552);
INSERT INTO public.book_theme (id, book, theme) VALUES (3409, 34, 544);
INSERT INTO public.book_theme (id, book, theme) VALUES (3410, 35, 543);
INSERT INTO public.book_theme (id, book, theme) VALUES (3411, 35, 550);
INSERT INTO public.book_theme (id, book, theme) VALUES (3412, 36, 548);
INSERT INTO public.book_theme (id, book, theme) VALUES (3413, 36, 541);
INSERT INTO public.book_theme (id, book, theme) VALUES (3414, 36, 544);
INSERT INTO public.book_theme (id, book, theme) VALUES (3415, 37, 546);
INSERT INTO public.book_theme (id, book, theme) VALUES (3416, 38, 546);


--
-- TOC entry 3155 (class 0 OID 49504)
-- Dependencies: 209
-- Data for Name: cart; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.cart (cart_id, "user", ordered) VALUES (2, 2, false);
INSERT INTO public.cart (cart_id, "user", ordered) VALUES (3, 3, false);
INSERT INTO public.cart (cart_id, "user", ordered) VALUES (4, 4, false);
INSERT INTO public.cart (cart_id, "user", ordered) VALUES (1, 1, true);
INSERT INTO public.cart (cart_id, "user", ordered) VALUES (5, 1, true);
INSERT INTO public.cart (cart_id, "user", ordered) VALUES (7, 1, false);
INSERT INTO public.cart (cart_id, "user", ordered) VALUES (6, 1, true);
INSERT INTO public.cart (cart_id, "user", ordered) VALUES (8, 1, false);
INSERT INTO public.cart (cart_id, "user", ordered) VALUES (9, 5, false);


--
-- TOC entry 3157 (class 0 OID 49518)
-- Dependencies: 211
-- Data for Name: cart_book; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- TOC entry 3171 (class 0 OID 49659)
-- Dependencies: 225
-- Data for Name: event; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- TOC entry 3145 (class 0 OID 49426)
-- Dependencies: 199
-- Data for Name: genre; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.genre (genre_id, name, description) VALUES (496, 'Fantasy', NULL);
INSERT INTO public.genre (genre_id, name, description) VALUES (497, 'Noir', NULL);
INSERT INTO public.genre (genre_id, name, description) VALUES (498, 'Thriller', NULL);
INSERT INTO public.genre (genre_id, name, description) VALUES (499, 'Hystorical', NULL);
INSERT INTO public.genre (genre_id, name, description) VALUES (500, 'Noir', NULL);
INSERT INTO public.genre (genre_id, name, description) VALUES (501, 'Comedy', NULL);
INSERT INTO public.genre (genre_id, name, description) VALUES (502, 'Drama', NULL);
INSERT INTO public.genre (genre_id, name, description) VALUES (503, 'Horror', NULL);
INSERT INTO public.genre (genre_id, name, description) VALUES (504, 'HumorPoetry', NULL);
INSERT INTO public.genre (genre_id, name, description) VALUES (505, 'Legend', NULL);
INSERT INTO public.genre (genre_id, name, description) VALUES (506, 'Religious', NULL);


--
-- TOC entry 3173 (class 0 OID 49677)
-- Dependencies: 227
-- Data for Name: order; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."order" (order_id, user_id, shipment_address, shipping_method, payment_method, cart, order_date) VALUES (1, 1, 7, 'Delivery', 'PayPal', 1, '2019-07-03 23:02:12.238+02');
INSERT INTO public."order" (order_id, user_id, shipment_address, shipping_method, payment_method, cart, order_date) VALUES (2, 1, 8, 'Delivery', 'PayPal', 1, '2019-07-03 23:02:12.249+02');
INSERT INTO public."order" (order_id, user_id, shipment_address, shipping_method, payment_method, cart, order_date) VALUES (3, 1, 9, 'Delivery', 'Bank Transfer', 5, '2019-07-03 23:07:12.083+02');
INSERT INTO public."order" (order_id, user_id, shipment_address, shipping_method, payment_method, cart, order_date) VALUES (4, 1, 10, 'Delivery', 'PayPal', 6, '2019-07-04 09:46:22.544+02');


--
-- TOC entry 3151 (class 0 OID 49470)
-- Dependencies: 205
-- Data for Name: publisher; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.publisher (publisher_id, hq_location, name) VALUES (316, NULL, 'Zanichelli');
INSERT INTO public.publisher (publisher_id, hq_location, name) VALUES (317, NULL, 'La Feltrinelli');
INSERT INTO public.publisher (publisher_id, hq_location, name) VALUES (318, NULL, 'Garzanti');
INSERT INTO public.publisher (publisher_id, hq_location, name) VALUES (319, NULL, 'Mondadori');
INSERT INTO public.publisher (publisher_id, hq_location, name) VALUES (320, NULL, 'Hoepli');
INSERT INTO public.publisher (publisher_id, hq_location, name) VALUES (321, NULL, 'Editori Riuniti');
INSERT INTO public.publisher (publisher_id, hq_location, name) VALUES (322, NULL, 'Pearson');


--
-- TOC entry 3165 (class 0 OID 49602)
-- Dependencies: 219
-- Data for Name: review; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- TOC entry 3163 (class 0 OID 49581)
-- Dependencies: 217
-- Data for Name: similar_book; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- TOC entry 3147 (class 0 OID 49437)
-- Dependencies: 201
-- Data for Name: theme; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.theme (theme_id, name, description) VALUES (541, 'Love', NULL);
INSERT INTO public.theme (theme_id, name, description) VALUES (542, 'Life', NULL);
INSERT INTO public.theme (theme_id, name, description) VALUES (543, 'Death', NULL);
INSERT INTO public.theme (theme_id, name, description) VALUES (544, 'Good vs. Evil', NULL);
INSERT INTO public.theme (theme_id, name, description) VALUES (545, 'Coming of Age', NULL);
INSERT INTO public.theme (theme_id, name, description) VALUES (546, 'Betrayal', NULL);
INSERT INTO public.theme (theme_id, name, description) VALUES (547, 'Power and Corruption', NULL);
INSERT INTO public.theme (theme_id, name, description) VALUES (548, 'Survival', NULL);
INSERT INTO public.theme (theme_id, name, description) VALUES (549, 'Courage and Heroism', NULL);
INSERT INTO public.theme (theme_id, name, description) VALUES (550, 'Prejudice', NULL);
INSERT INTO public.theme (theme_id, name, description) VALUES (551, 'Society', NULL);
INSERT INTO public.theme (theme_id, name, description) VALUES (552, 'War', NULL);


--
-- TOC entry 3149 (class 0 OID 49449)
-- Dependencies: 203
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."user" (user_id, username, password, email, first_name, surname, birth_date, address, time_registered) VALUES (2, 'malta', '$2b$10$AQk/BPKfG7TCAM/EOIEVoup5a44xE21GypNSXuIjt9YlcR9DD7y7e', 'dsaf@sdaf.it', 'tygui', 'vvyuijo', '2019-07-04', NULL, NULL);
INSERT INTO public."user" (user_id, username, password, email, first_name, surname, birth_date, address, time_registered) VALUES (1, 'malta95', '$2b$10$eThIBRkFe0MSC4cYaJOKv.UvwT4EDDuRpwbTlVSKTVZ.DwOknrIN6', 'malta95@hotmail.it', 'Luca', 'Maltagliati', '1995-08-29', 3, NULL);
INSERT INTO public."user" (user_id, username, password, email, first_name, surname, birth_date, address, time_registered) VALUES (3, 'fabmas', '$2b$10$S8kEo8r/zmfjH17KbDqduuz3Mu5x9.vyynD.X7nP6ouM345uVgYCm', 'fabmas@gmail.com', 'Fabio', 'Masciopinto', '1992-02-29', NULL, NULL);
INSERT INTO public."user" (user_id, username, password, email, first_name, surname, birth_date, address, time_registered) VALUES (4, 'sadf', '$2b$10$1/QnhUAKFO8D23SRlNQtpetiWvoVNBzFeZN.pqqFAPwpW7MJ9zAaW', 'ciao@email.it', 'BElla', 'ciao', '2019-06-27', NULL, NULL);
INSERT INTO public."user" (user_id, username, password, email, first_name, surname, birth_date, address, time_registered) VALUES (5, 'mab', '$2b$10$q/JydJ0y8Z8DoB1eC1zFu.r71k/Xr6IBMZwbL4NBasl1vX4OUUDtG', 'mab@das.it', 'Mario', 'Bianci', '2019-07-20', NULL, NULL);


--
-- TOC entry 3195 (class 0 OID 0)
-- Dependencies: 196
-- Name: address_address_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.address_address_id_seq', 10, true);


--
-- TOC entry 3196 (class 0 OID 0)
-- Dependencies: 220
-- Name: author_author_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.author_author_id_seq', 1895, true);


--
-- TOC entry 3197 (class 0 OID 0)
-- Dependencies: 222
-- Name: author_book_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.author_book_id_seq', 2310, true);


--
-- TOC entry 3198 (class 0 OID 0)
-- Dependencies: 206
-- Name: book_book_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.book_book_id_seq', 1, false);


--
-- TOC entry 3199 (class 0 OID 0)
-- Dependencies: 212
-- Name: book_genre_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.book_genre_id_seq', 3357, true);


--
-- TOC entry 3200 (class 0 OID 0)
-- Dependencies: 214
-- Name: book_theme_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.book_theme_id_seq', 3416, true);


--
-- TOC entry 3201 (class 0 OID 0)
-- Dependencies: 210
-- Name: cart_book_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.cart_book_id_seq', 40, true);


--
-- TOC entry 3202 (class 0 OID 0)
-- Dependencies: 208
-- Name: cart_cart_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.cart_cart_id_seq', 9, true);


--
-- TOC entry 3203 (class 0 OID 0)
-- Dependencies: 224
-- Name: event_event_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.event_event_id_seq', 1, true);


--
-- TOC entry 3204 (class 0 OID 0)
-- Dependencies: 198
-- Name: genre_genre_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.genre_genre_id_seq', 506, true);


--
-- TOC entry 3205 (class 0 OID 0)
-- Dependencies: 226
-- Name: order_order_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.order_order_id_seq', 4, true);


--
-- TOC entry 3206 (class 0 OID 0)
-- Dependencies: 204
-- Name: publisher_publisher_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.publisher_publisher_id_seq', 322, true);


--
-- TOC entry 3207 (class 0 OID 0)
-- Dependencies: 218
-- Name: review_review_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.review_review_id_seq', 1, false);


--
-- TOC entry 3208 (class 0 OID 0)
-- Dependencies: 216
-- Name: similar_book_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.similar_book_id_seq', 1, true);


--
-- TOC entry 3209 (class 0 OID 0)
-- Dependencies: 200
-- Name: theme_theme_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.theme_theme_id_seq', 552, true);


--
-- TOC entry 3210 (class 0 OID 0)
-- Dependencies: 202
-- Name: user_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.user_user_id_seq', 5, true);


--
-- TOC entry 2941 (class 2606 OID 49423)
-- Name: address address_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.address
    ADD CONSTRAINT address_pkey PRIMARY KEY (address_id);


--
-- TOC entry 2983 (class 2606 OID 49644)
-- Name: author_book author_book_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.author_book
    ADD CONSTRAINT author_book_pkey PRIMARY KEY (id);


--
-- TOC entry 2981 (class 2606 OID 49636)
-- Name: author author_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.author
    ADD CONSTRAINT author_pkey PRIMARY KEY (author_id);


--
-- TOC entry 2973 (class 2606 OID 49598)
-- Name: similar_book book1_book2_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.similar_book
    ADD CONSTRAINT book1_book2_unique UNIQUE (book1, book2);


--
-- TOC entry 2985 (class 2606 OID 49656)
-- Name: author_book book_author_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.author_book
    ADD CONSTRAINT book_author_unique UNIQUE (book, author);


--
-- TOC entry 2965 (class 2606 OID 49546)
-- Name: book_genre book_genre_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.book_genre
    ADD CONSTRAINT book_genre_pkey PRIMARY KEY (id);


--
-- TOC entry 2967 (class 2606 OID 49558)
-- Name: book_genre book_genre_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.book_genre
    ADD CONSTRAINT book_genre_unique UNIQUE (book, genre);


--
-- TOC entry 2955 (class 2606 OID 49496)
-- Name: book book_isbn_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.book
    ADD CONSTRAINT book_isbn_unique UNIQUE (isbn);


--
-- TOC entry 2957 (class 2606 OID 49494)
-- Name: book book_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.book
    ADD CONSTRAINT book_pkey PRIMARY KEY (book_id);


--
-- TOC entry 2969 (class 2606 OID 49566)
-- Name: book_theme book_theme_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.book_theme
    ADD CONSTRAINT book_theme_pkey PRIMARY KEY (id);


--
-- TOC entry 2971 (class 2606 OID 49578)
-- Name: book_theme book_theme_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.book_theme
    ADD CONSTRAINT book_theme_unique UNIQUE (book, theme);


--
-- TOC entry 2961 (class 2606 OID 49524)
-- Name: cart_book cart_book_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cart_book
    ADD CONSTRAINT cart_book_pkey PRIMARY KEY (id);


--
-- TOC entry 2963 (class 2606 OID 49536)
-- Name: cart_book cart_book_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cart_book
    ADD CONSTRAINT cart_book_unique UNIQUE (cart, book);


--
-- TOC entry 2959 (class 2606 OID 49510)
-- Name: cart cart_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cart
    ADD CONSTRAINT cart_pkey PRIMARY KEY (cart_id);


--
-- TOC entry 2987 (class 2606 OID 49664)
-- Name: event event_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.event
    ADD CONSTRAINT event_pkey PRIMARY KEY (event_id);


--
-- TOC entry 2943 (class 2606 OID 49434)
-- Name: genre genre_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.genre
    ADD CONSTRAINT genre_pkey PRIMARY KEY (genre_id);


--
-- TOC entry 2989 (class 2606 OID 49687)
-- Name: order order_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."order"
    ADD CONSTRAINT order_pkey PRIMARY KEY (order_id);


--
-- TOC entry 2953 (class 2606 OID 49475)
-- Name: publisher publisher_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.publisher
    ADD CONSTRAINT publisher_pkey PRIMARY KEY (publisher_id);


--
-- TOC entry 2977 (class 2606 OID 49611)
-- Name: review review_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.review
    ADD CONSTRAINT review_pkey PRIMARY KEY (review_id);


--
-- TOC entry 2975 (class 2606 OID 49586)
-- Name: similar_book similar_book_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.similar_book
    ADD CONSTRAINT similar_book_pkey PRIMARY KEY (id);


--
-- TOC entry 2945 (class 2606 OID 49445)
-- Name: theme theme_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.theme
    ADD CONSTRAINT theme_pkey PRIMARY KEY (theme_id);


--
-- TOC entry 2979 (class 2606 OID 49623)
-- Name: review user_book_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.review
    ADD CONSTRAINT user_book_unique UNIQUE ("user", book);


--
-- TOC entry 2947 (class 2606 OID 49461)
-- Name: user user_email_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_email_unique UNIQUE (email);


--
-- TOC entry 2949 (class 2606 OID 49457)
-- Name: user user_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (user_id);


--
-- TOC entry 2951 (class 2606 OID 49459)
-- Name: user user_username_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_username_unique UNIQUE (username);


--
-- TOC entry 3140 (class 2618 OID 54643)
-- Name: book_essentials _RETURN; Type: RULE; Schema: public; Owner: -
--

CREATE OR REPLACE VIEW public.book_essentials AS
 SELECT b.book_id,
    b.isbn,
    b.title,
    b.price,
    b.picture,
    b.abstract,
    b.interview,
    b.status,
    to_jsonb(pu.*) AS publisher,
    array_agg(DISTINCT ge.name) AS genres,
    array_agg(DISTINCT th.name) AS themes,
    jsonb_agg(DISTINCT to_jsonb(au.*)) AS authors,
    b.average_rating
   FROM (((((((public.book b
     LEFT JOIN public.publisher_essential pu ON ((b.publisher = pu.publisher_id)))
     LEFT JOIN public.book_genre bg ON ((bg.book = b.book_id)))
     LEFT JOIN public.genre ge ON ((bg.genre = ge.genre_id)))
     LEFT JOIN public.book_theme bt ON ((bt.book = b.book_id)))
     LEFT JOIN public.theme th ON ((th.theme_id = bt.theme)))
     LEFT JOIN public.author_book ab ON ((ab.book = b.book_id)))
     LEFT JOIN public.author_essential au ON ((au.author_id = ab.author)))
  GROUP BY b.book_id, pu.*;


--
-- TOC entry 3141 (class 2618 OID 54648)
-- Name: order_essentials _RETURN; Type: RULE; Schema: public; Owner: -
--

CREATE OR REPLACE VIEW public.order_essentials AS
 SELECT o.order_id,
    "user".user_id,
    o.payment_method,
    o.shipping_method,
    to_jsonb(ad.*) AS shipment_address,
    sum((b.price * (cb.quantity)::double precision)) AS total_amount,
    jsonb_agg(jsonb_build_object('book', b.*, 'quantity', cb.quantity)) AS books
   FROM (((((public."order" o
     LEFT JOIN public.address ad ON ((ad.address_id = o.shipment_address)))
     LEFT JOIN public.cart ON ((o.cart = cart.cart_id)))
     LEFT JOIN public.cart_book cb ON ((cb.cart = cart.cart_id)))
     LEFT JOIN public.book_essentials b ON ((b.book_id = cb.book)))
     LEFT JOIN public."user" ON ((cart."user" = "user".user_id)))
  GROUP BY "user".user_id, o.order_id, ad.*;


--
-- TOC entry 3011 (class 2620 OID 49467)
-- Name: user create_cart_trig; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER create_cart_trig AFTER INSERT ON public."user" FOR EACH ROW EXECUTE PROCEDURE public.create_cart();


--
-- TOC entry 3012 (class 2620 OID 49538)
-- Name: cart_book delete_on_zero_quantity; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER delete_on_zero_quantity AFTER UPDATE OF quantity ON public.cart_book FOR EACH ROW WHEN ((new.quantity <= 0)) EXECUTE PROCEDURE public.delete_cart_zero_quantity();


--
-- TOC entry 3014 (class 2620 OID 49625)
-- Name: review update_avg_rating_d; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_avg_rating_d AFTER DELETE ON public.review FOR EACH ROW EXECUTE PROCEDURE public.update_average_rating_old();


--
-- TOC entry 3013 (class 2620 OID 49624)
-- Name: review update_avg_rating_iu; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_avg_rating_iu AFTER INSERT OR UPDATE OF rating ON public.review FOR EACH ROW EXECUTE PROCEDURE public.update_average_rating_new();


--
-- TOC entry 3015 (class 2620 OID 49704)
-- Name: order update_cart_after_insert; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_cart_after_insert AFTER INSERT ON public."order" FOR EACH ROW EXECUTE PROCEDURE public.update_cart_on_order();


--
-- TOC entry 3005 (class 2606 OID 49650)
-- Name: author_book author_book_author_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.author_book
    ADD CONSTRAINT author_book_author_foreign FOREIGN KEY (author) REFERENCES public.author(author_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3004 (class 2606 OID 49645)
-- Name: author_book author_book_book_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.author_book
    ADD CONSTRAINT author_book_book_foreign FOREIGN KEY (book) REFERENCES public.book(book_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 2996 (class 2606 OID 49547)
-- Name: book_genre book_genre_book_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.book_genre
    ADD CONSTRAINT book_genre_book_foreign FOREIGN KEY (book) REFERENCES public.book(book_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 2997 (class 2606 OID 49552)
-- Name: book_genre book_genre_genre_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.book_genre
    ADD CONSTRAINT book_genre_genre_foreign FOREIGN KEY (genre) REFERENCES public.genre(genre_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 2992 (class 2606 OID 49497)
-- Name: book book_publisher_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.book
    ADD CONSTRAINT book_publisher_foreign FOREIGN KEY (publisher) REFERENCES public.publisher(publisher_id);


--
-- TOC entry 2998 (class 2606 OID 49567)
-- Name: book_theme book_theme_book_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.book_theme
    ADD CONSTRAINT book_theme_book_foreign FOREIGN KEY (book) REFERENCES public.book(book_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 2999 (class 2606 OID 49572)
-- Name: book_theme book_theme_theme_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.book_theme
    ADD CONSTRAINT book_theme_theme_foreign FOREIGN KEY (theme) REFERENCES public.theme(theme_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 2995 (class 2606 OID 49530)
-- Name: cart_book cart_book_book_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cart_book
    ADD CONSTRAINT cart_book_book_foreign FOREIGN KEY (book) REFERENCES public.book(book_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 2994 (class 2606 OID 49525)
-- Name: cart_book cart_book_cart_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cart_book
    ADD CONSTRAINT cart_book_cart_foreign FOREIGN KEY (cart) REFERENCES public.cart(cart_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 2993 (class 2606 OID 49511)
-- Name: cart cart_user_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cart
    ADD CONSTRAINT cart_user_foreign FOREIGN KEY ("user") REFERENCES public."user"(user_id);


--
-- TOC entry 3007 (class 2606 OID 49670)
-- Name: event event_book_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.event
    ADD CONSTRAINT event_book_foreign FOREIGN KEY (book) REFERENCES public.book(book_id);


--
-- TOC entry 3006 (class 2606 OID 49665)
-- Name: event event_location_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.event
    ADD CONSTRAINT event_location_foreign FOREIGN KEY (location) REFERENCES public.address(address_id);


--
-- TOC entry 3010 (class 2606 OID 49698)
-- Name: order order_cart_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."order"
    ADD CONSTRAINT order_cart_foreign FOREIGN KEY (cart) REFERENCES public.cart(cart_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3009 (class 2606 OID 49693)
-- Name: order order_shipment_address_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."order"
    ADD CONSTRAINT order_shipment_address_foreign FOREIGN KEY (shipment_address) REFERENCES public.address(address_id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3008 (class 2606 OID 49688)
-- Name: order order_user_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."order"
    ADD CONSTRAINT order_user_id_foreign FOREIGN KEY (user_id) REFERENCES public."user"(user_id) ON UPDATE CASCADE;


--
-- TOC entry 2991 (class 2606 OID 49476)
-- Name: publisher publisher_hq_location_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.publisher
    ADD CONSTRAINT publisher_hq_location_foreign FOREIGN KEY (hq_location) REFERENCES public.address(address_id);


--
-- TOC entry 3003 (class 2606 OID 49617)
-- Name: review review_book_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.review
    ADD CONSTRAINT review_book_foreign FOREIGN KEY (book) REFERENCES public.book(book_id);


--
-- TOC entry 3002 (class 2606 OID 49612)
-- Name: review review_user_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.review
    ADD CONSTRAINT review_user_foreign FOREIGN KEY ("user") REFERENCES public."user"(user_id);


--
-- TOC entry 3000 (class 2606 OID 49587)
-- Name: similar_book similar_book_book1_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.similar_book
    ADD CONSTRAINT similar_book_book1_foreign FOREIGN KEY (book1) REFERENCES public.book(book_id);


--
-- TOC entry 3001 (class 2606 OID 49592)
-- Name: similar_book similar_book_book2_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.similar_book
    ADD CONSTRAINT similar_book_book2_foreign FOREIGN KEY (book2) REFERENCES public.book(book_id);


--
-- TOC entry 2990 (class 2606 OID 49462)
-- Name: user user_address_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_address_foreign FOREIGN KEY (address) REFERENCES public.address(address_id) ON UPDATE CASCADE ON DELETE SET NULL;


-- Completed on 2019-07-04 17:11:04 CEST

--
-- PostgreSQL database dump complete
--

