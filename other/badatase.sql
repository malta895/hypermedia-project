--
-- PostgreSQL database dump
--

-- Dumped from database version 11.3
-- Dumped by pg_dump version 11.3

-- Started on 2019-07-04 16:35:02 CEST

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
-- TOC entry 228 (class 1259 OID 54050)
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
-- TOC entry 231 (class 1259 OID 54062)
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
-- TOC entry 232 (class 1259 OID 54067)
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
-- TOC entry 229 (class 1259 OID 54054)
-- Name: publisher_complete; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.publisher_complete AS
 SELECT publisher.publisher_id,
    publisher.name,
    to_jsonb(ad.*) AS hq_address
   FROM (public.publisher
     LEFT JOIN public.address ad ON ((ad.address_id = publisher.hq_location)));


--
-- TOC entry 230 (class 1259 OID 54058)
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

INSERT INTO public.author (author_id, name, biography, picture) VALUES (1498, 'Suzanne Collins', NULL, NULL);
INSERT INTO public.author (author_id, name, biography, picture) VALUES (1499, 'Stephenie Meyer', NULL, NULL);
INSERT INTO public.author (author_id, name, biography, picture) VALUES (1500, 'Harper Lee', NULL, NULL);
INSERT INTO public.author (author_id, name, biography, picture) VALUES (1501, 'F. Scott Fitzgerald', NULL, NULL);
INSERT INTO public.author (author_id, name, biography, picture) VALUES (1502, 'John Green', NULL, NULL);
INSERT INTO public.author (author_id, name, biography, picture) VALUES (1503, 'Veronica Roth', NULL, NULL);
INSERT INTO public.author (author_id, name, biography, picture) VALUES (1504, 'J.R.R. Tolkien', NULL, NULL);
INSERT INTO public.author (author_id, name, biography, picture) VALUES (1505, 'Jane Austen', NULL, NULL);
INSERT INTO public.author (author_id, name, biography, picture) VALUES (1506, 'J.D. Salinger', NULL, NULL);
INSERT INTO public.author (author_id, name, biography, picture) VALUES (1507, 'Dan Brown', NULL, NULL);
INSERT INTO public.author (author_id, name, biography, picture) VALUES (1508, 'George Orwell', NULL, NULL);
INSERT INTO public.author (author_id, name, biography, picture) VALUES (1509, ' Erich Fromm', NULL, NULL);
INSERT INTO public.author (author_id, name, biography, picture) VALUES (1510, ' Celâl Üster', NULL, NULL);
INSERT INTO public.author (author_id, name, biography, picture) VALUES (1511, 'Stieg Larsson', NULL, NULL);
INSERT INTO public.author (author_id, name, biography, picture) VALUES (1512, ' Reg Keeland', NULL, NULL);
INSERT INTO public.author (author_id, name, biography, picture) VALUES (1513, 'Khaled Hosseini', NULL, NULL);
INSERT INTO public.author (author_id, name, biography, picture) VALUES (1514, 'J.K. Rowling', NULL, NULL);
INSERT INTO public.author (author_id, name, biography, picture) VALUES (1515, ' Mary GrandPré', NULL, NULL);
INSERT INTO public.author (author_id, name, biography, picture) VALUES (1516, 'William Golding', NULL, NULL);
INSERT INTO public.author (author_id, name, biography, picture) VALUES (1517, 'Alice Sebold', NULL, NULL);
INSERT INTO public.author (author_id, name, biography, picture) VALUES (1518, 'Gillian Flynn', NULL, NULL);
INSERT INTO public.author (author_id, name, biography, picture) VALUES (1519, 'Kathryn Stockett', NULL, NULL);
INSERT INTO public.author (author_id, name, biography, picture) VALUES (1520, 'C.S. Lewis', NULL, NULL);
INSERT INTO public.author (author_id, name, biography, picture) VALUES (1521, 'John Steinbeck', NULL, NULL);
INSERT INTO public.author (author_id, name, biography, picture) VALUES (1522, 'George R.R. Martin', NULL, NULL);
INSERT INTO public.author (author_id, name, biography, picture) VALUES (1523, 'E.L. James', NULL, NULL);


--
-- TOC entry 3169 (class 0 OID 49639)
-- Dependencies: 223
-- Data for Name: author_book; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.author_book (id, book, author) VALUES (1622, 0, 1498);
INSERT INTO public.author_book (id, book, author) VALUES (1623, 1, 1499);
INSERT INTO public.author_book (id, book, author) VALUES (1624, 2, 1500);
INSERT INTO public.author_book (id, book, author) VALUES (1625, 3, 1501);
INSERT INTO public.author_book (id, book, author) VALUES (1626, 4, 1502);
INSERT INTO public.author_book (id, book, author) VALUES (1627, 5, 1503);
INSERT INTO public.author_book (id, book, author) VALUES (1628, 6, 1504);
INSERT INTO public.author_book (id, book, author) VALUES (1629, 7, 1505);
INSERT INTO public.author_book (id, book, author) VALUES (1630, 8, 1506);
INSERT INTO public.author_book (id, book, author) VALUES (1631, 9, 1507);
INSERT INTO public.author_book (id, book, author) VALUES (1632, 10, 1508);
INSERT INTO public.author_book (id, book, author) VALUES (1633, 10, 1509);
INSERT INTO public.author_book (id, book, author) VALUES (1634, 10, 1510);
INSERT INTO public.author_book (id, book, author) VALUES (1635, 11, 1498);
INSERT INTO public.author_book (id, book, author) VALUES (1636, 12, 1508);
INSERT INTO public.author_book (id, book, author) VALUES (1637, 13, 1511);
INSERT INTO public.author_book (id, book, author) VALUES (1638, 13, 1512);
INSERT INTO public.author_book (id, book, author) VALUES (1639, 14, 1513);
INSERT INTO public.author_book (id, book, author) VALUES (1640, 15, 1498);
INSERT INTO public.author_book (id, book, author) VALUES (1641, 16, 1514);
INSERT INTO public.author_book (id, book, author) VALUES (1642, 16, 1515);
INSERT INTO public.author_book (id, book, author) VALUES (1643, 17, 1514);
INSERT INTO public.author_book (id, book, author) VALUES (1644, 17, 1515);
INSERT INTO public.author_book (id, book, author) VALUES (1645, 18, 1504);
INSERT INTO public.author_book (id, book, author) VALUES (1646, 19, 1516);
INSERT INTO public.author_book (id, book, author) VALUES (1647, 20, 1517);
INSERT INTO public.author_book (id, book, author) VALUES (1648, 21, 1518);
INSERT INTO public.author_book (id, book, author) VALUES (1649, 22, 1519);
INSERT INTO public.author_book (id, book, author) VALUES (1650, 23, 1520);
INSERT INTO public.author_book (id, book, author) VALUES (1651, 24, 1507);
INSERT INTO public.author_book (id, book, author) VALUES (1652, 25, 1521);
INSERT INTO public.author_book (id, book, author) VALUES (1653, 26, 1522);
INSERT INTO public.author_book (id, book, author) VALUES (1654, 27, 1523);


--
-- TOC entry 3153 (class 0 OID 49483)
-- Dependencies: 207
-- Data for Name: book; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.book (book_id, isbn, title, price, price_currency, picture, abstract, interview, status, publisher, average_rating) VALUES (0, '439023483', 'The Hunger Games', 43, NULL, 'https://images.gr-assets.com/books/1447303603l/2767052.jpg', 'Lorem ipsum', NULL, 'Available', 246, NULL);
INSERT INTO public.book (book_id, isbn, title, price, price_currency, picture, abstract, interview, status, publisher, average_rating) VALUES (1, '316015849', 'Twilight', 13, NULL, 'https://images.gr-assets.com/books/1361039443l/41865.jpg', 'Lorem ipsum', NULL, 'Available', 247, NULL);
INSERT INTO public.book (book_id, isbn, title, price, price_currency, picture, abstract, interview, status, publisher, average_rating) VALUES (2, '61120081', 'To Kill a Mockingbird', 38, NULL, 'https://images.gr-assets.com/books/1361975680l/2657.jpg', 'Lorem ipsum', NULL, 'Available', 248, NULL);
INSERT INTO public.book (book_id, isbn, title, price, price_currency, picture, abstract, interview, status, publisher, average_rating) VALUES (3, '743273567', 'The Great Gatsby', 46, NULL, 'https://images.gr-assets.com/books/1490528560l/4671.jpg', 'Lorem ipsum', NULL, 'Available', 250, NULL);
INSERT INTO public.book (book_id, isbn, title, price, price_currency, picture, abstract, interview, status, publisher, average_rating) VALUES (4, '525478817', 'The Fault in Our Stars', 19, NULL, 'https://images.gr-assets.com/books/1360206420l/11870085.jpg', 'Lorem ipsum', NULL, 'Available', 246, NULL);
INSERT INTO public.book (book_id, isbn, title, price, price_currency, picture, abstract, interview, status, publisher, average_rating) VALUES (5, '62024035', 'Divergent', 40, NULL, 'https://images.gr-assets.com/books/1328559506l/13335037.jpg', 'Lorem ipsum', NULL, 'Available', 252, NULL);
INSERT INTO public.book (book_id, isbn, title, price, price_currency, picture, abstract, interview, status, publisher, average_rating) VALUES (6, '618260307', 'The Hobbit or There and Back Again', 48, NULL, 'https://images.gr-assets.com/books/1372847500l/5907.jpg', 'Lorem ipsum', NULL, 'Available', 250, NULL);
INSERT INTO public.book (book_id, isbn, title, price, price_currency, picture, abstract, interview, status, publisher, average_rating) VALUES (7, '679783261', 'Pride and Prejudice', 13, NULL, 'https://images.gr-assets.com/books/1320399351l/1885.jpg', 'Lorem ipsum', NULL, 'Available', 248, NULL);
INSERT INTO public.book (book_id, isbn, title, price, price_currency, picture, abstract, interview, status, publisher, average_rating) VALUES (8, '316769177', 'The Catcher in the Rye', 34, NULL, 'https://images.gr-assets.com/books/1398034300l/5107.jpg', 'Lorem ipsum', NULL, 'Available', 251, NULL);
INSERT INTO public.book (book_id, isbn, title, price, price_currency, picture, abstract, interview, status, publisher, average_rating) VALUES (9, '1416524797', 'Angels & Demons ', 27, NULL, 'https://images.gr-assets.com/books/1303390735l/960.jpg', 'Lorem ipsum', NULL, 'Available', 250, NULL);
INSERT INTO public.book (book_id, isbn, title, price, price_currency, picture, abstract, interview, status, publisher, average_rating) VALUES (10, '451524934', 'Nineteen Eighty-Four', 23, NULL, 'https://images.gr-assets.com/books/1348990566l/5470.jpg', 'Lorem ipsum', NULL, 'Available', 250, NULL);
INSERT INTO public.book (book_id, isbn, title, price, price_currency, picture, abstract, interview, status, publisher, average_rating) VALUES (11, '439023491', 'Catching Fire', 27, NULL, 'https://images.gr-assets.com/books/1358273780l/6148028.jpg', 'Lorem ipsum', NULL, 'Available', 250, NULL);
INSERT INTO public.book (book_id, isbn, title, price, price_currency, picture, abstract, interview, status, publisher, average_rating) VALUES (12, '452284244', 'Animal Farm: A Fairy Story', 16, NULL, 'https://images.gr-assets.com/books/1424037542l/7613.jpg', 'Lorem ipsum', NULL, 'Available', 246, NULL);
INSERT INTO public.book (book_id, isbn, title, price, price_currency, picture, abstract, interview, status, publisher, average_rating) VALUES (13, '307269752', 'Män som hatar kvinnor', 35, NULL, 'https://images.gr-assets.com/books/1327868566l/2429135.jpg', 'Lorem ipsum', NULL, 'Available', 251, NULL);
INSERT INTO public.book (book_id, isbn, title, price, price_currency, picture, abstract, interview, status, publisher, average_rating) VALUES (14, '1594480001', 'The Kite Runner ', 27, NULL, 'https://images.gr-assets.com/books/1484565687l/77203.jpg', 'Lorem ipsum', NULL, 'Available', 246, NULL);
INSERT INTO public.book (book_id, isbn, title, price, price_currency, picture, abstract, interview, status, publisher, average_rating) VALUES (15, '439023513', 'Mockingjay', 9, NULL, 'https://images.gr-assets.com/books/1358275419l/7260188.jpg', 'Lorem ipsum', NULL, 'Available', 247, NULL);
INSERT INTO public.book (book_id, isbn, title, price, price_currency, picture, abstract, interview, status, publisher, average_rating) VALUES (16, '439139600', 'Harry Potter and the Goblet of Fire', 11, NULL, 'https://images.gr-assets.com/books/1361482611l/6.jpg', 'Lorem ipsum', NULL, 'Available', 249, NULL);
INSERT INTO public.book (book_id, isbn, title, price, price_currency, picture, abstract, interview, status, publisher, average_rating) VALUES (17, '545010225', 'Harry Potter and the Deathly Hallows', 9, NULL, 'https://images.gr-assets.com/books/1474171184l/136251.jpg', 'Lorem ipsum', NULL, 'Available', 249, NULL);
INSERT INTO public.book (book_id, isbn, title, price, price_currency, picture, abstract, interview, status, publisher, average_rating) VALUES (18, '618346252', ' The Fellowship of the Ring', 37, NULL, 'https://images.gr-assets.com/books/1298411339l/34.jpg', 'Lorem ipsum', NULL, 'Available', 251, NULL);
INSERT INTO public.book (book_id, isbn, title, price, price_currency, picture, abstract, interview, status, publisher, average_rating) VALUES (19, '140283331', 'Lord of the Flies ', 26, NULL, 'https://images.gr-assets.com/books/1327869409l/7624.jpg', 'Lorem ipsum', NULL, 'Available', 251, NULL);
INSERT INTO public.book (book_id, isbn, title, price, price_currency, picture, abstract, interview, status, publisher, average_rating) VALUES (20, '316166685', 'The Lovely Bones', 24, NULL, 'https://images.gr-assets.com/books/1457810586l/12232938.jpg', 'Lorem ipsum', NULL, 'Available', 250, NULL);
INSERT INTO public.book (book_id, isbn, title, price, price_currency, picture, abstract, interview, status, publisher, average_rating) VALUES (21, '297859382', 'Gone Girl', 46, NULL, 'https://images.gr-assets.com/books/1339602131l/8442457.jpg', 'Lorem ipsum', NULL, 'Available', 251, NULL);
INSERT INTO public.book (book_id, isbn, title, price, price_currency, picture, abstract, interview, status, publisher, average_rating) VALUES (22, '399155341', 'The Help', 38, NULL, 'https://images.gr-assets.com/books/1346100365l/4667024.jpg', 'Lorem ipsum', NULL, 'Available', 250, NULL);
INSERT INTO public.book (book_id, isbn, title, price, price_currency, picture, abstract, interview, status, publisher, average_rating) VALUES (23, '60764899', 'The Lion, the Witch and the Wardrobe', 29, NULL, 'https://images.gr-assets.com/books/1353029077l/100915.jpg', 'Lorem ipsum', NULL, 'Available', 251, NULL);
INSERT INTO public.book (book_id, isbn, title, price, price_currency, picture, abstract, interview, status, publisher, average_rating) VALUES (24, '307277674', 'The Da Vinci Code', 17, NULL, 'https://images.gr-assets.com/books/1303252999l/968.jpg', 'Lorem ipsum', NULL, 'Available', 248, NULL);
INSERT INTO public.book (book_id, isbn, title, price, price_currency, picture, abstract, interview, status, publisher, average_rating) VALUES (25, '142000671', 'Of Mice and Men ', 30, NULL, 'https://images.gr-assets.com/books/1437235233l/890.jpg', 'Lorem ipsum', NULL, 'Available', 252, NULL);
INSERT INTO public.book (book_id, isbn, title, price, price_currency, picture, abstract, interview, status, publisher, average_rating) VALUES (26, '553588486', 'A Game of Thrones', 38, NULL, 'https://images.gr-assets.com/books/1436732693l/13496.jpg', 'Lorem ipsum', NULL, 'Available', 249, NULL);
INSERT INTO public.book (book_id, isbn, title, price, price_currency, picture, abstract, interview, status, publisher, average_rating) VALUES (27, '1612130291', 'Fifty Shades of Grey', 32, NULL, 'https://images.gr-assets.com/books/1385207843l/10818853.jpg', 'Lorem ipsum', NULL, 'Available', 249, NULL);


--
-- TOC entry 3159 (class 0 OID 49541)
-- Dependencies: 213
-- Data for Name: book_genre; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.book_genre (id, book, genre) VALUES (2504, 0, 388);
INSERT INTO public.book_genre (id, book, genre) VALUES (2505, 0, 396);
INSERT INTO public.book_genre (id, book, genre) VALUES (2506, 1, 389);
INSERT INTO public.book_genre (id, book, genre) VALUES (2507, 1, 386);
INSERT INTO public.book_genre (id, book, genre) VALUES (2508, 2, 395);
INSERT INTO public.book_genre (id, book, genre) VALUES (2509, 2, 394);
INSERT INTO public.book_genre (id, book, genre) VALUES (2510, 3, 386);
INSERT INTO public.book_genre (id, book, genre) VALUES (2511, 4, 392);
INSERT INTO public.book_genre (id, book, genre) VALUES (2512, 4, 393);
INSERT INTO public.book_genre (id, book, genre) VALUES (2513, 5, 393);
INSERT INTO public.book_genre (id, book, genre) VALUES (2514, 5, 389);
INSERT INTO public.book_genre (id, book, genre) VALUES (2515, 5, 387);
INSERT INTO public.book_genre (id, book, genre) VALUES (2516, 6, 387);
INSERT INTO public.book_genre (id, book, genre) VALUES (2517, 6, 389);
INSERT INTO public.book_genre (id, book, genre) VALUES (2518, 7, 392);
INSERT INTO public.book_genre (id, book, genre) VALUES (2519, 7, 387);
INSERT INTO public.book_genre (id, book, genre) VALUES (2520, 7, 395);
INSERT INTO public.book_genre (id, book, genre) VALUES (2521, 8, 394);
INSERT INTO public.book_genre (id, book, genre) VALUES (2522, 8, 391);
INSERT INTO public.book_genre (id, book, genre) VALUES (2523, 9, 390);
INSERT INTO public.book_genre (id, book, genre) VALUES (2524, 9, 387);
INSERT INTO public.book_genre (id, book, genre) VALUES (2525, 9, 388);
INSERT INTO public.book_genre (id, book, genre) VALUES (2526, 10, 395);
INSERT INTO public.book_genre (id, book, genre) VALUES (2527, 11, 394);
INSERT INTO public.book_genre (id, book, genre) VALUES (2528, 11, 392);
INSERT INTO public.book_genre (id, book, genre) VALUES (2529, 12, 395);
INSERT INTO public.book_genre (id, book, genre) VALUES (2530, 12, 394);
INSERT INTO public.book_genre (id, book, genre) VALUES (2531, 12, 389);
INSERT INTO public.book_genre (id, book, genre) VALUES (2532, 13, 396);
INSERT INTO public.book_genre (id, book, genre) VALUES (2533, 13, 393);
INSERT INTO public.book_genre (id, book, genre) VALUES (2534, 14, 386);
INSERT INTO public.book_genre (id, book, genre) VALUES (2535, 15, 395);
INSERT INTO public.book_genre (id, book, genre) VALUES (2536, 16, 393);
INSERT INTO public.book_genre (id, book, genre) VALUES (2537, 17, 394);
INSERT INTO public.book_genre (id, book, genre) VALUES (2538, 17, 393);
INSERT INTO public.book_genre (id, book, genre) VALUES (2539, 18, 390);
INSERT INTO public.book_genre (id, book, genre) VALUES (2540, 19, 391);
INSERT INTO public.book_genre (id, book, genre) VALUES (2541, 20, 388);
INSERT INTO public.book_genre (id, book, genre) VALUES (2542, 20, 395);
INSERT INTO public.book_genre (id, book, genre) VALUES (2543, 20, 394);
INSERT INTO public.book_genre (id, book, genre) VALUES (2544, 21, 391);
INSERT INTO public.book_genre (id, book, genre) VALUES (2545, 22, 394);
INSERT INTO public.book_genre (id, book, genre) VALUES (2546, 22, 388);
INSERT INTO public.book_genre (id, book, genre) VALUES (2547, 23, 386);
INSERT INTO public.book_genre (id, book, genre) VALUES (2548, 23, 390);
INSERT INTO public.book_genre (id, book, genre) VALUES (2549, 23, 387);
INSERT INTO public.book_genre (id, book, genre) VALUES (2550, 24, 395);
INSERT INTO public.book_genre (id, book, genre) VALUES (2551, 25, 395);
INSERT INTO public.book_genre (id, book, genre) VALUES (2552, 26, 391);
INSERT INTO public.book_genre (id, book, genre) VALUES (2553, 26, 390);
INSERT INTO public.book_genre (id, book, genre) VALUES (2554, 27, 392);


--
-- TOC entry 3161 (class 0 OID 49561)
-- Dependencies: 215
-- Data for Name: book_theme; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.book_theme (id, book, theme) VALUES (2553, 0, 426);
INSERT INTO public.book_theme (id, book, theme) VALUES (2554, 1, 429);
INSERT INTO public.book_theme (id, book, theme) VALUES (2555, 1, 428);
INSERT INTO public.book_theme (id, book, theme) VALUES (2556, 1, 426);
INSERT INTO public.book_theme (id, book, theme) VALUES (2557, 2, 429);
INSERT INTO public.book_theme (id, book, theme) VALUES (2558, 3, 431);
INSERT INTO public.book_theme (id, book, theme) VALUES (2559, 3, 425);
INSERT INTO public.book_theme (id, book, theme) VALUES (2560, 4, 427);
INSERT INTO public.book_theme (id, book, theme) VALUES (2561, 5, 429);
INSERT INTO public.book_theme (id, book, theme) VALUES (2562, 6, 430);
INSERT INTO public.book_theme (id, book, theme) VALUES (2563, 6, 421);
INSERT INTO public.book_theme (id, book, theme) VALUES (2564, 6, 422);
INSERT INTO public.book_theme (id, book, theme) VALUES (2565, 7, 421);
INSERT INTO public.book_theme (id, book, theme) VALUES (2566, 8, 421);
INSERT INTO public.book_theme (id, book, theme) VALUES (2567, 8, 429);
INSERT INTO public.book_theme (id, book, theme) VALUES (2568, 8, 431);
INSERT INTO public.book_theme (id, book, theme) VALUES (2569, 9, 423);
INSERT INTO public.book_theme (id, book, theme) VALUES (2570, 9, 431);
INSERT INTO public.book_theme (id, book, theme) VALUES (2571, 9, 426);
INSERT INTO public.book_theme (id, book, theme) VALUES (2572, 10, 424);
INSERT INTO public.book_theme (id, book, theme) VALUES (2573, 11, 421);
INSERT INTO public.book_theme (id, book, theme) VALUES (2574, 12, 431);
INSERT INTO public.book_theme (id, book, theme) VALUES (2575, 13, 430);
INSERT INTO public.book_theme (id, book, theme) VALUES (2576, 13, 432);
INSERT INTO public.book_theme (id, book, theme) VALUES (2577, 14, 430);
INSERT INTO public.book_theme (id, book, theme) VALUES (2578, 14, 426);
INSERT INTO public.book_theme (id, book, theme) VALUES (2579, 15, 426);
INSERT INTO public.book_theme (id, book, theme) VALUES (2580, 15, 432);
INSERT INTO public.book_theme (id, book, theme) VALUES (2581, 15, 423);
INSERT INTO public.book_theme (id, book, theme) VALUES (2582, 16, 426);
INSERT INTO public.book_theme (id, book, theme) VALUES (2583, 17, 424);
INSERT INTO public.book_theme (id, book, theme) VALUES (2584, 17, 431);
INSERT INTO public.book_theme (id, book, theme) VALUES (2585, 18, 425);
INSERT INTO public.book_theme (id, book, theme) VALUES (2586, 18, 423);
INSERT INTO public.book_theme (id, book, theme) VALUES (2587, 18, 421);
INSERT INTO public.book_theme (id, book, theme) VALUES (2588, 19, 426);
INSERT INTO public.book_theme (id, book, theme) VALUES (2589, 19, 427);
INSERT INTO public.book_theme (id, book, theme) VALUES (2590, 20, 429);
INSERT INTO public.book_theme (id, book, theme) VALUES (2591, 20, 432);
INSERT INTO public.book_theme (id, book, theme) VALUES (2592, 21, 426);
INSERT INTO public.book_theme (id, book, theme) VALUES (2593, 21, 429);
INSERT INTO public.book_theme (id, book, theme) VALUES (2594, 22, 430);
INSERT INTO public.book_theme (id, book, theme) VALUES (2595, 22, 426);
INSERT INTO public.book_theme (id, book, theme) VALUES (2596, 22, 432);
INSERT INTO public.book_theme (id, book, theme) VALUES (2597, 23, 422);
INSERT INTO public.book_theme (id, book, theme) VALUES (2598, 23, 431);
INSERT INTO public.book_theme (id, book, theme) VALUES (2599, 23, 426);
INSERT INTO public.book_theme (id, book, theme) VALUES (2600, 24, 424);
INSERT INTO public.book_theme (id, book, theme) VALUES (2601, 24, 422);
INSERT INTO public.book_theme (id, book, theme) VALUES (2602, 25, 425);
INSERT INTO public.book_theme (id, book, theme) VALUES (2603, 25, 431);
INSERT INTO public.book_theme (id, book, theme) VALUES (2604, 25, 428);
INSERT INTO public.book_theme (id, book, theme) VALUES (2605, 26, 427);
INSERT INTO public.book_theme (id, book, theme) VALUES (2606, 27, 422);


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

INSERT INTO public.genre (genre_id, name, description) VALUES (386, 'Fantasy', NULL);
INSERT INTO public.genre (genre_id, name, description) VALUES (387, 'Noir', NULL);
INSERT INTO public.genre (genre_id, name, description) VALUES (388, 'Thriller', NULL);
INSERT INTO public.genre (genre_id, name, description) VALUES (389, 'Hystorical', NULL);
INSERT INTO public.genre (genre_id, name, description) VALUES (390, 'Noir', NULL);
INSERT INTO public.genre (genre_id, name, description) VALUES (391, 'Comedy', NULL);
INSERT INTO public.genre (genre_id, name, description) VALUES (392, 'Drama', NULL);
INSERT INTO public.genre (genre_id, name, description) VALUES (393, 'Horror', NULL);
INSERT INTO public.genre (genre_id, name, description) VALUES (394, 'HumorPoetry', NULL);
INSERT INTO public.genre (genre_id, name, description) VALUES (395, 'Legend', NULL);
INSERT INTO public.genre (genre_id, name, description) VALUES (396, 'Religious', NULL);


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

INSERT INTO public.publisher (publisher_id, hq_location, name) VALUES (246, NULL, 'Zanichelli');
INSERT INTO public.publisher (publisher_id, hq_location, name) VALUES (247, NULL, 'La Feltrinelli');
INSERT INTO public.publisher (publisher_id, hq_location, name) VALUES (248, NULL, 'Garzanti');
INSERT INTO public.publisher (publisher_id, hq_location, name) VALUES (249, NULL, 'Mondadori');
INSERT INTO public.publisher (publisher_id, hq_location, name) VALUES (250, NULL, 'Hoepli');
INSERT INTO public.publisher (publisher_id, hq_location, name) VALUES (251, NULL, 'Editori Riuniti');
INSERT INTO public.publisher (publisher_id, hq_location, name) VALUES (252, NULL, 'Pearson');


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

INSERT INTO public.theme (theme_id, name, description) VALUES (421, 'Love', NULL);
INSERT INTO public.theme (theme_id, name, description) VALUES (422, 'Life', NULL);
INSERT INTO public.theme (theme_id, name, description) VALUES (423, 'Death', NULL);
INSERT INTO public.theme (theme_id, name, description) VALUES (424, 'Good vs. Evil', NULL);
INSERT INTO public.theme (theme_id, name, description) VALUES (425, 'Coming of Age', NULL);
INSERT INTO public.theme (theme_id, name, description) VALUES (426, 'Betrayal', NULL);
INSERT INTO public.theme (theme_id, name, description) VALUES (427, 'Power and Corruption', NULL);
INSERT INTO public.theme (theme_id, name, description) VALUES (428, 'Survival', NULL);
INSERT INTO public.theme (theme_id, name, description) VALUES (429, 'Courage and Heroism', NULL);
INSERT INTO public.theme (theme_id, name, description) VALUES (430, 'Prejudice', NULL);
INSERT INTO public.theme (theme_id, name, description) VALUES (431, 'Society', NULL);
INSERT INTO public.theme (theme_id, name, description) VALUES (432, 'War', NULL);


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

SELECT pg_catalog.setval('public.author_author_id_seq', 1523, true);


--
-- TOC entry 3197 (class 0 OID 0)
-- Dependencies: 222
-- Name: author_book_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.author_book_id_seq', 1654, true);


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

SELECT pg_catalog.setval('public.book_genre_id_seq', 2554, true);


--
-- TOC entry 3200 (class 0 OID 0)
-- Dependencies: 214
-- Name: book_theme_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.book_theme_id_seq', 2606, true);


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

SELECT pg_catalog.setval('public.genre_genre_id_seq', 396, true);


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

SELECT pg_catalog.setval('public.publisher_publisher_id_seq', 252, true);


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

SELECT pg_catalog.setval('public.theme_theme_id_seq', 432, true);


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
-- TOC entry 3140 (class 2618 OID 54065)
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
-- TOC entry 3141 (class 2618 OID 54070)
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


-- Completed on 2019-07-04 16:35:03 CEST

--
-- PostgreSQL database dump complete
--

