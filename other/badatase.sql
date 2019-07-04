--
-- PostgreSQL database dump
--

-- Dumped from database version 11.2
-- Dumped by pg_dump version 11.2

-- Started on 2019-07-04 22:56:38 CEST

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 5 (class 2615 OID 41554)
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA public;


--
-- TOC entry 246 (class 1255 OID 41555)
-- Name: create_cart(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.create_cart() RETURNS trigger
    LANGUAGE plpgsql
    AS $$BEGIN
INSERT INTO cart("user") VALUES(new.user_id);
RETURN NEW;
END;$$;


--
-- TOC entry 247 (class 1255 OID 41556)
-- Name: delete_cart_zero_quantity(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.delete_cart_zero_quantity() RETURNS trigger
    LANGUAGE plpgsql
    AS $$BEGIN
DELETE FROM cart_book WHERE cart_book.id = old.id;
RETURN NEW;
END$$;


--
-- TOC entry 248 (class 1255 OID 41557)
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
-- TOC entry 249 (class 1255 OID 41558)
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
-- TOC entry 233 (class 1255 OID 41559)
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
-- TOC entry 196 (class 1259 OID 41560)
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
-- TOC entry 197 (class 1259 OID 41566)
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
-- TOC entry 3422 (class 0 OID 0)
-- Dependencies: 197
-- Name: address_address_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.address_address_id_seq OWNED BY public.address.address_id;


--
-- TOC entry 198 (class 1259 OID 41568)
-- Name: author; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.author (
    author_id integer NOT NULL,
    name character varying(255) NOT NULL,
    biography text,
    picture character varying(255)
);


--
-- TOC entry 199 (class 1259 OID 41574)
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
-- TOC entry 3423 (class 0 OID 0)
-- Dependencies: 199
-- Name: author_author_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.author_author_id_seq OWNED BY public.author.author_id;


--
-- TOC entry 200 (class 1259 OID 41576)
-- Name: author_book; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.author_book (
    id integer NOT NULL,
    book integer,
    author integer
);


--
-- TOC entry 201 (class 1259 OID 41579)
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
-- TOC entry 3424 (class 0 OID 0)
-- Dependencies: 201
-- Name: author_book_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.author_book_id_seq OWNED BY public.author_book.id;


--
-- TOC entry 228 (class 1259 OID 41960)
-- Name: author_essential; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.author_essential AS
 SELECT author.author_id,
    author.name,
    author.picture
   FROM public.author;


--
-- TOC entry 202 (class 1259 OID 41585)
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
-- TOC entry 203 (class 1259 OID 41594)
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
-- TOC entry 3425 (class 0 OID 0)
-- Dependencies: 203
-- Name: book_book_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.book_book_id_seq OWNED BY public.book.book_id;


--
-- TOC entry 231 (class 1259 OID 41972)
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
-- TOC entry 204 (class 1259 OID 41600)
-- Name: book_genre; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.book_genre (
    id integer NOT NULL,
    book integer NOT NULL,
    genre integer NOT NULL
);


--
-- TOC entry 205 (class 1259 OID 41603)
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
-- TOC entry 3426 (class 0 OID 0)
-- Dependencies: 205
-- Name: book_genre_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.book_genre_id_seq OWNED BY public.book_genre.id;


--
-- TOC entry 206 (class 1259 OID 41605)
-- Name: book_theme; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.book_theme (
    id integer NOT NULL,
    book integer NOT NULL,
    theme integer NOT NULL
);


--
-- TOC entry 207 (class 1259 OID 41608)
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
-- TOC entry 3427 (class 0 OID 0)
-- Dependencies: 207
-- Name: book_theme_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.book_theme_id_seq OWNED BY public.book_theme.id;


--
-- TOC entry 208 (class 1259 OID 41610)
-- Name: cart; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cart (
    cart_id integer NOT NULL,
    "user" integer NOT NULL,
    ordered boolean DEFAULT false NOT NULL
);


--
-- TOC entry 209 (class 1259 OID 41614)
-- Name: cart_book; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cart_book (
    id integer NOT NULL,
    cart integer NOT NULL,
    book integer NOT NULL,
    quantity integer DEFAULT 1 NOT NULL
);


--
-- TOC entry 210 (class 1259 OID 41618)
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
-- TOC entry 3428 (class 0 OID 0)
-- Dependencies: 210
-- Name: cart_book_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.cart_book_id_seq OWNED BY public.cart_book.id;


--
-- TOC entry 211 (class 1259 OID 41620)
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
-- TOC entry 3429 (class 0 OID 0)
-- Dependencies: 211
-- Name: cart_cart_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.cart_cart_id_seq OWNED BY public.cart.cart_id;


--
-- TOC entry 212 (class 1259 OID 41622)
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
-- TOC entry 213 (class 1259 OID 41625)
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
-- TOC entry 3430 (class 0 OID 0)
-- Dependencies: 213
-- Name: event_event_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.event_event_id_seq OWNED BY public.event.event_id;


--
-- TOC entry 214 (class 1259 OID 41627)
-- Name: genre; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.genre (
    genre_id integer NOT NULL,
    name character varying(255) NOT NULL,
    description text
);


--
-- TOC entry 215 (class 1259 OID 41633)
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
-- TOC entry 3431 (class 0 OID 0)
-- Dependencies: 215
-- Name: genre_genre_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.genre_genre_id_seq OWNED BY public.genre.genre_id;


--
-- TOC entry 216 (class 1259 OID 41635)
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
-- TOC entry 232 (class 1259 OID 41977)
-- Name: order_essentials; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.order_essentials AS
SELECT
    NULL::integer AS order_id,
    NULL::integer AS user_id,
    NULL::text AS payment_method,
    NULL::text AS shipping_method,
    NULL::timestamp with time zone AS order_date,
    NULL::jsonb AS shipment_address,
    NULL::double precision AS total_amount,
    NULL::jsonb AS books;


--
-- TOC entry 217 (class 1259 OID 41647)
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
-- TOC entry 3432 (class 0 OID 0)
-- Dependencies: 217
-- Name: order_order_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.order_order_id_seq OWNED BY public."order".order_id;


--
-- TOC entry 218 (class 1259 OID 41649)
-- Name: publisher; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.publisher (
    publisher_id integer NOT NULL,
    hq_location integer,
    name character varying(255) NOT NULL
);


--
-- TOC entry 229 (class 1259 OID 41964)
-- Name: publisher_complete; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.publisher_complete AS
 SELECT publisher.publisher_id,
    publisher.name,
    to_jsonb(ad.*) AS hq_address
   FROM (public.publisher
     LEFT JOIN public.address ad ON ((ad.address_id = publisher.hq_location)));


--
-- TOC entry 230 (class 1259 OID 41968)
-- Name: publisher_essential; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.publisher_essential AS
 SELECT publisher.publisher_id,
    publisher.name
   FROM public.publisher;


--
-- TOC entry 219 (class 1259 OID 41660)
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
-- TOC entry 3433 (class 0 OID 0)
-- Dependencies: 219
-- Name: publisher_publisher_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.publisher_publisher_id_seq OWNED BY public.publisher.publisher_id;


--
-- TOC entry 220 (class 1259 OID 41662)
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
-- TOC entry 221 (class 1259 OID 41668)
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
-- TOC entry 3434 (class 0 OID 0)
-- Dependencies: 221
-- Name: review_review_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.review_review_id_seq OWNED BY public.review.review_id;


--
-- TOC entry 222 (class 1259 OID 41670)
-- Name: similar_book; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.similar_book (
    id integer NOT NULL,
    book1 integer NOT NULL,
    book2 integer NOT NULL
);


--
-- TOC entry 223 (class 1259 OID 41673)
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
-- TOC entry 3435 (class 0 OID 0)
-- Dependencies: 223
-- Name: similar_book_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.similar_book_id_seq OWNED BY public.similar_book.id;


--
-- TOC entry 224 (class 1259 OID 41675)
-- Name: theme; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.theme (
    theme_id integer NOT NULL,
    name character varying(255) NOT NULL,
    description text
);


--
-- TOC entry 225 (class 1259 OID 41681)
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
-- TOC entry 3436 (class 0 OID 0)
-- Dependencies: 225
-- Name: theme_theme_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.theme_theme_id_seq OWNED BY public.theme.theme_id;


--
-- TOC entry 226 (class 1259 OID 41683)
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
-- TOC entry 227 (class 1259 OID 41689)
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
-- TOC entry 3437 (class 0 OID 0)
-- Dependencies: 227
-- Name: user_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.user_user_id_seq OWNED BY public."user".user_id;


--
-- TOC entry 3160 (class 2604 OID 41691)
-- Name: address address_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.address ALTER COLUMN address_id SET DEFAULT nextval('public.address_address_id_seq'::regclass);


--
-- TOC entry 3161 (class 2604 OID 41692)
-- Name: author author_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.author ALTER COLUMN author_id SET DEFAULT nextval('public.author_author_id_seq'::regclass);


--
-- TOC entry 3162 (class 2604 OID 41693)
-- Name: author_book id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.author_book ALTER COLUMN id SET DEFAULT nextval('public.author_book_id_seq'::regclass);


--
-- TOC entry 3165 (class 2604 OID 41694)
-- Name: book book_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.book ALTER COLUMN book_id SET DEFAULT nextval('public.book_book_id_seq'::regclass);


--
-- TOC entry 3167 (class 2604 OID 41695)
-- Name: book_genre id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.book_genre ALTER COLUMN id SET DEFAULT nextval('public.book_genre_id_seq'::regclass);


--
-- TOC entry 3168 (class 2604 OID 41696)
-- Name: book_theme id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.book_theme ALTER COLUMN id SET DEFAULT nextval('public.book_theme_id_seq'::regclass);


--
-- TOC entry 3170 (class 2604 OID 41697)
-- Name: cart cart_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cart ALTER COLUMN cart_id SET DEFAULT nextval('public.cart_cart_id_seq'::regclass);


--
-- TOC entry 3172 (class 2604 OID 41698)
-- Name: cart_book id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cart_book ALTER COLUMN id SET DEFAULT nextval('public.cart_book_id_seq'::regclass);


--
-- TOC entry 3173 (class 2604 OID 41699)
-- Name: event event_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.event ALTER COLUMN event_id SET DEFAULT nextval('public.event_event_id_seq'::regclass);


--
-- TOC entry 3174 (class 2604 OID 41700)
-- Name: genre genre_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.genre ALTER COLUMN genre_id SET DEFAULT nextval('public.genre_genre_id_seq'::regclass);


--
-- TOC entry 3175 (class 2604 OID 41701)
-- Name: order order_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."order" ALTER COLUMN order_id SET DEFAULT nextval('public.order_order_id_seq'::regclass);


--
-- TOC entry 3178 (class 2604 OID 41702)
-- Name: publisher publisher_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.publisher ALTER COLUMN publisher_id SET DEFAULT nextval('public.publisher_publisher_id_seq'::regclass);


--
-- TOC entry 3179 (class 2604 OID 41703)
-- Name: review review_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.review ALTER COLUMN review_id SET DEFAULT nextval('public.review_review_id_seq'::regclass);


--
-- TOC entry 3180 (class 2604 OID 41704)
-- Name: similar_book id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.similar_book ALTER COLUMN id SET DEFAULT nextval('public.similar_book_id_seq'::regclass);


--
-- TOC entry 3181 (class 2604 OID 41705)
-- Name: theme theme_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.theme ALTER COLUMN theme_id SET DEFAULT nextval('public.theme_theme_id_seq'::regclass);


--
-- TOC entry 3182 (class 2604 OID 41706)
-- Name: user user_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."user" ALTER COLUMN user_id SET DEFAULT nextval('public.user_user_id_seq'::regclass);


--
-- TOC entry 3385 (class 0 OID 41560)
-- Dependencies: 196
-- Data for Name: address; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.address (address_id, first_name, last_name, street_line1, street_line2, city, zip_code, province, country) VALUES (3, 'LUCA', 'MALTAGLIATI', 'VIA SALVO D''ACQUISTO 424', '', 'TAVERNERIO', '22038', 'CO', 'ITALY');
INSERT INTO public.address (address_id, first_name, last_name, street_line1, street_line2, city, zip_code, province, country) VALUES (7, 'LUCA', 'MALTAGLIATI', '', NULL, 'TAVERNERIO', '22038', 'CO', 'ITALY');
INSERT INTO public.address (address_id, first_name, last_name, street_line1, street_line2, city, zip_code, province, country) VALUES (8, 'LUCA', 'MALTAGLIATI', '', NULL, 'TAVERNERIO', '22038', 'CO', 'ITALY');
INSERT INTO public.address (address_id, first_name, last_name, street_line1, street_line2, city, zip_code, province, country) VALUES (9, 'LUCA', 'MALTAGLIATI', '', NULL, 'TAVERNERIO', '22038', 'CO', 'ITALY');
INSERT INTO public.address (address_id, first_name, last_name, street_line1, street_line2, city, zip_code, province, country) VALUES (10, 'LUCA', 'MALTAGLIATI', '', NULL, 'TAVERNERIO', '22038', 'CO', 'ITALY');
INSERT INTO public.address (address_id, first_name, last_name, street_line1, street_line2, city, zip_code, province, country) VALUES (11, 'Mondadori', 'Milan', 'Mondadori, Duomo Milan', NULL, 'Milan', '20019', 'MI', 'ITALY');


--
-- TOC entry 3387 (class 0 OID 41568)
-- Dependencies: 198
-- Data for Name: author; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.author (author_id, name, biography, picture) VALUES (1895, ' Linda Antonsson', 'Elio Miguel García Jr. (born May 6, 1978) and Linda Maria Antonsson (born November 18, 1974) are authors known for their contributions and expertise in the A Song of Ice and Fire series by George R. R. Martin, co-writing in 2014 with Martin The World of Ice & Fire, a companion book for the series. They are also the founders of the fansite Westeros.org, one of the earliest fan websites for A Song of Ice and Fire.', 'https://cust-images.grenadine.co/grenadine/image/upload/c_fill,f_jpg,g_face,h_1472,w_1472/v0/Worldcon75/LindaAntonsson_1553.jpg');
INSERT INTO public.author (author_id, name, biography, picture) VALUES (1894, ' Elio M. García Jr.', 'Elio Miguel García Jr. (born May 6, 1978) and Linda Maria Antonsson (born November 18, 1974) are authors known for their contributions and expertise in the A Song of Ice and Fire series by George R. R. Martin, co-writing in 2014 with Martin The World of Ice & Fire, a companion book for the series. They are also the founders of the fansite Westeros.org, one of the earliest fan websites for A Song of Ice and Fire.', 'https://www.worldswithoutend.com/authors/ElioMGarciaJr.jpg');
INSERT INTO public.author (author_id, name, biography, picture) VALUES (1891, 'Ben Avery', 'Avery was originally a presbyterian minister at Bartholomew Close, London, but quit the ministry in 1720, in consequence of the Salters'' Hall controversy on subscription, 1719. He practised as a physician, and was treasurer of Guy''s Hospital. He retained the confidence of his presbyterian brethren, and acted for several years as secretary to the dissenting deputies, organised 1732, for the protection of the rights and redress of the grievances of the three denominations. He was a trustee of Dr. Williams''s Library, 1728–64, and his portrait hangs in the library. He died 23 July 1764.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Oswald_T._Avery_portrait_1937.jpg/220px-Oswald_T._Avery_portrait_1937.jpg');
INSERT INTO public.author (author_id, name, biography, picture) VALUES (1890, ' Gary Gianni', 'Gary Gianni (born 1954) is an American comics artist best known for his eight years illustrating the syndicated newspaper comic Prince Valiant.

After Gianni graduated from the Chicago Academy of Fine Arts in 1976, he worked for the Chicago Tribune as an illustrator and network television news as a courtroom sketch artist.', 'https://www.jimkeefe.com/blog/wp-content/uploads/2012/04/P4150010.jpg');
INSERT INTO public.author (author_id, name, biography, picture) VALUES (1877, 'J.K. Rowling', 'Joanne Rowling CH, OBE, FRSL, FRCPE, FRSE (/ˈroʊlɪŋ/ "rolling"; born 31 July 1965), better known by her pen names J. K. Rowling and Robert Galbraith, is a British novelist, screenwriter, producer, and philanthropist. She is best known for writing the Harry Potter fantasy series, which has won multiple awards and sold more than 500 million copies, becoming the best-selling book series in history. The Harry Potter books have also been the basis for the popular film series of the same name, over which Rowling had overall approval on the scripts and was a producer on the final films.', 'https://upload.wikimedia.org/wikipedia/commons/5/5d/J._K._Rowling_2010.jpg');
INSERT INTO public.author (author_id, name, biography, picture) VALUES (1876, 'Dan Brown', 'Daniel Gerhard Brown (born June 22, 1964) is an American author best known for his thriller novels, including the Robert Langdon novels Angels & Demons (2000), The Da Vinci Code (2003), The Lost Symbol (2009), Inferno (2013) and Origin (2017). His novels are treasure hunts that usually take place over a period of 24 hours.[2] They feature recurring themes of cryptography, art, and conspiracy theories. His books have been translated into 57 languages and, as of 2012, have sold over 200 million copies. Three of them, Angels & Demons (2000), The Da Vinci Code (2003) and Inferno (2013) have been adapted into films.', 'https://upload.wikimedia.org/wikipedia/commons/8/8b/Dan_Brown_bookjacket_cropped.jpg');
INSERT INTO public.author (author_id, name, biography, picture) VALUES (1875, 'J.R.R. Tolkien', 'John Ronald Reuel Tolkien CBE FRSL (/ruːl ˈtɒlkiːn/ ROOL TOL-keen;[a] 3 January 1892 – 2 September 1973) was an English writer, poet, philologist, and academic, who is best known as the author of the classic high fantasy works The Hobbit, The Lord of the Rings, and The Silmarillion.

He served as the Rawlinson and Bosworth Professor of Anglo-Saxon and Fellow of Pembroke College, Oxford, from 1925 to 1945 and Merton Professor of English Language and Literature and Fellow of Merton College, Oxford, from 1945 to 1959.[3] He was at one time a close friend of C. S. Lewis—they were both members of the informal literary discussion group known as the Inklings. Tolkien was appointed a Commander of the Order of the British Empire by Queen Elizabeth II on 28 March 1972.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Tolkien_1916-2.jpg/220px-Tolkien_1916-2.jpg');
INSERT INTO public.author (author_id, name, biography, picture) VALUES (1874, 'Suzanne Collins', 'Suzanne Collins (born August 10, 1962) is an American television writer and author. She is known as the author of The New York Times best-selling series The Underland Chronicles and The Hunger Games trilogy.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Suzanne_Collins_David_Shankbone_2010.jpg/220px-Suzanne_Collins_David_Shankbone_2010.jpg');
INSERT INTO public.author (author_id, name, biography, picture) VALUES (1892, ' Mike S. Miller', 'Mike S. Miller (born 1971) is an American comic book illustrator and writer, who has done work published by companies including Malibu Comics, Marvel Comics, DC Comics, and Image Comics, as well as self-published work under the imprint Alias Enterprises. Some of his better known work is on DC''s Injustice: Gods Among Us series.', 'https://i1.wp.com/thefreedomforge.com/tff/wp-content/uploads/2018/02/msm.png?resize=363%2C480');
INSERT INTO public.author (author_id, name, biography, picture) VALUES (1878, ' Mary GrandPré', 'Mary GrandPré (born February 13, 1954) is an American illustrator best known for her cover and chapter illustrations of the Harry Potter books in their U.S. editions published by Scholastic. She received a Caldecott Honor citation in 2015 for illustrating Barb Rosenstock''s The Noisy Paint Box: The Colors and Sounds of Kandinsky''s Abstract Art. GrandPré, who creates her artwork with paint and pastels, has illustrated more than twenty books and has appeared in gallery exhibitions and periodicals such as The New Yorker, Atlantic Monthly, and The Wall Street Journal.', 'https://upload.wikimedia.org/wikipedia/commons/8/89/Mary_GrandPr%C3%A9%2C_2011.jpg');
INSERT INTO public.author (author_id, name, biography, picture) VALUES (1879, 'George R.R. Martin', 'George Raymond Richard Martin (born George Raymond Martin, September 20, 1948), also known as GRRM, is an American novelist and short story writer in the fantasy, horror, and science fiction genres, screenwriter, and television producer. He is best known for his series of epic fantasy novels, A Song of Ice and Fire, which was adapted into the HBO series Game of Thrones (2011–2019).', 'https://si.wsj.net/public/resources/images/B3-CJ972_WOLFE_FR_20181115130206.jpg');
INSERT INTO public.author (author_id, name, biography, picture) VALUES (1881, 'Robert Galbraith', 'Joanne Rowling CH, OBE, FRSL, FRCPE, FRSE (/ˈroʊlɪŋ/ "rolling"; born 31 July 1965), better known by her pen names J. K. Rowling and Robert Galbraith, is a British novelist, screenwriter, producer, and philanthropist. She is best known for writing the Harry Potter fantasy series, which has won multiple awards and sold more than 500 million copies, becoming the best-selling book series in history. The Harry Potter books have also been the basis for the popular film series of the same name, over which Rowling had overall approval on the scripts  and was a producer on the final films.', 'https://images-na.ssl-images-amazon.com/images/S/amzn-author-media-prod/n6qh79ch54gempmqujvt43o2u0._UX250_.jpg');
INSERT INTO public.author (author_id, name, biography, picture) VALUES (1888, ' Sean Deming', NULL, 'https://aforismi.meglio.it/img/frasi/ignoto.jpg');
INSERT INTO public.author (author_id, name, biography, picture) VALUES (1880, 'Christopher Paolini', 'Christopher James Paolini (born November 17, 1983 in Los Angeles, California) is an American author. He is the author of The Inheritance Cycle, which consists of the books Eragon, Eldest, Brisingr, and Inheritance. He lives in Paradise Valley, Montana, where he wrote his first book.', 'http://www.nelcastellodicarta.it/libri/libri-bambini-ragazzi-classici-moderni/foto/christopher-paolini.jpg');
INSERT INTO public.author (author_id, name, biography, picture) VALUES (1887, ' David Wenzel', 'David T. Wenzel (/ˈwɛnzəl/; born November 22, 1950) is an illustrator and children''s book artist. He is best known for his graphic novel adaptation of J.R.R. Tolkien''s The Hobbit.', 'https://www.newhaven.edu/_resources/images/faculty-staff-headshots/david-wenzel.png');
INSERT INTO public.author (author_id, name, biography, picture) VALUES (1889, 'Kennilworthy Whisp', 'Kennilworthy Whisp was an author and Quidditch expert, known for having written a number of Quidditch-related works, including Quidditch Through the Ages. Whisp resided in Nottinghamshire in England, and divided his time between his home and wherever the Wigtown Wanderers were playing. His hobbies included playing backgammon, vegetarian cookery, and collecting vintage broomsticks. Despite liking vegetarian cookery, he was not a vegetarian.', 'https://aforismi.meglio.it/img/frasi/ignoto.jpg');
INSERT INTO public.author (author_id, name, biography, picture) VALUES (1885, 'Chuck Dixon', 'Charles Dixon (born April 14, 1954) is an American comic book writer, best known for his work on the Marvel Comics character the Punisher and on the DC Comics characters Batman, Nightwing, and Robin in the 1990s and early 2000s.', 'https://static.comicvine.com/uploads/scale_small/10/100647/2876509-dixon.jpg');
INSERT INTO public.author (author_id, name, biography, picture) VALUES (1884, ' Ted Nasmith', 'Ted Nasmith (born 1956) is a Canadian artist, illustrator and architectural renderer. He is best known as an illustrator of J. R. R. Tolkien''s works — The Hobbit, The Lord of the Rings and The Silmarillion.

Nasmith was born in Goderich, Ontario, Canada. As the son of a Royal Canadian Air Force officer, Nasmith''s childhood was characterized by a series of moves, chiefly when his father was stationed in eastern France when Ted was 2 years old, until the family returned to Ontario 3 years later. By the time Nasmith became a teenager, they had settled in Don Mills, a suburb of Toronto (he now resides in nearby Newmarket.)', 'https://upload.wikimedia.org/wikipedia/commons/3/30/TedNasmith.jpg');
INSERT INTO public.author (author_id, name, biography, picture) VALUES (1883, ' Christopher Tolkien', 'Christopher John Reuel Tolkien (born 21 November 1924) is the third son of the author J. R. R. Tolkien (1892–1973), and the editor of much of his father''s posthumously published work. He drew the original maps for his father''s The Lord of the Rings, which he signed C. J. R. T.', 'https://i2.wp.com/www.jrrtolkien.it/wp-content/uploads/2012/07/Christopher-Tolkien.jpg');


--
-- TOC entry 3389 (class 0 OID 41576)
-- Dependencies: 200
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
INSERT INTO public.author_book (id, book, author) VALUES (2282, 22, 1877);
INSERT INTO public.author_book (id, book, author) VALUES (2283, 23, 1880);
INSERT INTO public.author_book (id, book, author) VALUES (2284, 24, 1877);
INSERT INTO public.author_book (id, book, author) VALUES (2285, 25, 1877);
INSERT INTO public.author_book (id, book, author) VALUES (2286, 26, 1875);
INSERT INTO public.author_book (id, book, author) VALUES (2287, 26, 1883);
INSERT INTO public.author_book (id, book, author) VALUES (2288, 26, 1884);
INSERT INTO public.author_book (id, book, author) VALUES (2289, 27, 1874);
INSERT INTO public.author_book (id, book, author) VALUES (2290, 28, 1885);
INSERT INTO public.author_book (id, book, author) VALUES (2292, 28, 1887);
INSERT INTO public.author_book (id, book, author) VALUES (2293, 28, 1888);
INSERT INTO public.author_book (id, book, author) VALUES (2294, 29, 1881);
INSERT INTO public.author_book (id, book, author) VALUES (2296, 30, 1889);
INSERT INTO public.author_book (id, book, author) VALUES (2298, 31, 1875);
INSERT INTO public.author_book (id, book, author) VALUES (2299, 32, 1879);
INSERT INTO public.author_book (id, book, author) VALUES (2300, 33, 1874);
INSERT INTO public.author_book (id, book, author) VALUES (2301, 34, 1874);
INSERT INTO public.author_book (id, book, author) VALUES (2302, 35, 1879);
INSERT INTO public.author_book (id, book, author) VALUES (2303, 35, 1890);
INSERT INTO public.author_book (id, book, author) VALUES (2304, 36, 1874);
INSERT INTO public.author_book (id, book, author) VALUES (2305, 37, 1891);
INSERT INTO public.author_book (id, book, author) VALUES (2306, 37, 1892);
INSERT INTO public.author_book (id, book, author) VALUES (2308, 38, 1879);
INSERT INTO public.author_book (id, book, author) VALUES (2309, 38, 1894);
INSERT INTO public.author_book (id, book, author) VALUES (2310, 38, 1895);
INSERT INTO public.author_book (id, book, author) VALUES (2307, 37, 1879);
INSERT INTO public.author_book (id, book, author) VALUES (2281, 21, 1877);
INSERT INTO public.author_book (id, book, author) VALUES (2295, 29, 1877);
INSERT INTO public.author_book (id, book, author) VALUES (2297, 30, 1877);
INSERT INTO public.author_book (id, book, author) VALUES (2291, 28, 1875);


--
-- TOC entry 3391 (class 0 OID 41585)
-- Dependencies: 202
-- Data for Name: book; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.book (book_id, isbn, title, price, price_currency, picture, abstract, interview, status, publisher, average_rating) VALUES (0, '439023483', 'The Hunger Games', 19, NULL, 'https://images.gr-assets.com/books/1447303603l/2767052.jpg', 'The Hunger Games is a trilogy of young adult dystopian novels written by American novelist Suzanne Collins. The series is set in The Hunger Games universe, and follows young Katniss Everdeen.

The novels in the trilogy are titled The Hunger Games (2008), Catching Fire (2009), and Mockingjay (2010). The novels have all been developed into films starring Jennifer Lawrence, with the film adaptation of Mockingjay split into two parts. The first two books in the series were both New York Times best sellers, and Mockingjay topped all US bestseller lists upon its release.[1][2] By the time the film adaptation of The Hunger Games was released in 2012, the publisher had reported over 26 million Hunger Games trilogy books in print, including movie tie-in books.[3]

The Hunger Games universe is a dystopia set in Panem, a North American country consisting of the wealthy Capitol and 12 districts in varying states of poverty. Every year, children from the districts are selected via lottery to participate in a compulsory televised battle royale death match called The Hunger Games.', NULL, 'Available', 319, NULL);
INSERT INTO public.book (book_id, isbn, title, price, price_currency, picture, abstract, interview, status, publisher, average_rating) VALUES (4, '439023513', 'Mockingjay', 36, NULL, 'https://images.gr-assets.com/books/1358275419l/7260188.jpg', 'Mockingjay is a 2010 science fiction novel by American author Suzanne Collins. It is the last installment of The Hunger Games, following 2008''s The Hunger Games and 2009''s Catching Fire. The book continues the story of Katniss Everdeen, who agrees to unify the districts of Panem in a rebellion against the tyrannical Capitol.

The hardcover and audiobook editions of Mockingjay were published by Scholastic on August 24, 2010, six days after the ebook edition went on sale. The book sold 450,000 copies in the first week of release, exceeding the publisher''s expectations. It received a generally positive reaction from critics. The novel was adapted into two films. The first part was released on November 21, 2014, while the second part was released on November 20, 2015.', NULL, 'Available', 317, NULL);
INSERT INTO public.book (book_id, isbn, title, price, price_currency, picture, abstract, interview, status, publisher, average_rating) VALUES (11, '553381695', 'A Clash of Kings', 45, NULL, 'https://images.gr-assets.com/books/1358254974l/10572.jpg', 'A Clash of Kings is the second novel in A Song of Ice and Fire, an epic fantasy series by American author George R. R. Martin expected to consist of seven volumes. It was first published on 16 November 1998 in the United Kingdom, although the first United States edition did not follow until February 2, 1999[2] Like its predecessor, A Game of Thrones, it won the Locus Award (in 1999) for Best Novel and was nominated for the Nebula Award (also in 1999) for best novel. In May 2005 Meisha Merlin released a limited edition of the novel, fully illustrated by John Howe.

The novel has been adapted for television by HBO as the second season of the TV series Game of Thrones.', NULL, 'Available', 322, NULL);
INSERT INTO public.book (book_id, isbn, title, price, price_currency, picture, abstract, interview, status, publisher, average_rating) VALUES (12, '618346260', 'The Two Towers', 42, NULL, 'https://images.gr-assets.com/books/1298415523l/15241.jpg', 'The Two Towers is the second volume of J. R. R. Tolkien''s high fantasy novel The Lord of the Rings. It is preceded by The Fellowship of the Ring and followed by The Return of the King.', NULL, 'Available', 322, NULL);
INSERT INTO public.book (book_id, isbn, title, price, price_currency, picture, abstract, interview, status, publisher, average_rating) VALUES (14, '345339738', 'The Return of the King', 15, NULL, 'https://images.gr-assets.com/books/1389977161l/18512.jpg', 'The Return of the King is the third and final volume of J. R. R. Tolkien''s The Lord of the Rings, following The Fellowship of the Ring and The Two Towers. The story begins in the kingdom of Gondor, which is soon to be attacked by the Dark Lord Sauron.

', NULL, 'Available', 320, NULL);
INSERT INTO public.book (book_id, isbn, title, price, price_currency, picture, abstract, interview, status, publisher, average_rating) VALUES (18, '216023788', 'A Dance with Dragons', 49, NULL, 'https://images.gr-assets.com/books/1327885335l/10664113.jpg', 'A Dance with Dragons is the fifth novel, of seven planned, in the epic fantasy series A Song of Ice and Fire by American author George R. R. Martin. In some areas, the paperback edition was published in two parts, titled Dreams and Dust and After the Feast. It was the first novel in the series to be published following the commencement of the HBO series adaptation, Game of Thrones, and runs to 1,040 pages with a word count of almost 415,000.', NULL, 'Available', 319, NULL);
INSERT INTO public.book (book_id, isbn, title, price, price_currency, picture, abstract, interview, status, publisher, average_rating) VALUES (21, '316206849', 'The Cuckoo''s Calling', 42, NULL, 'https://images.gr-assets.com/books/1358716559l/16160797.jpg', 'The Cuckoo''s Calling is a 2013 crime fiction novel by J. K. Rowling, published under the pseudonym Robert Galbraith. It is the first novel in the Cormoran Strike series of detective novels and was followed by The Silkworm in 2014, Career of Evil in 2015, and Lethal White in 2018.', NULL, 'Available', 319, NULL);
INSERT INTO public.book (book_id, isbn, title, price, price_currency, picture, abstract, interview, status, publisher, average_rating) VALUES (25, '545044251', 'Complete Harry Potter Boxed Set', 30, NULL, 'https://images.gr-assets.com/books/1392579059l/862041.jpg', 'The complete collection of the Harry Potter saga.', NULL, 'Available', 321, NULL);
INSERT INTO public.book (book_id, isbn, title, price, price_currency, picture, abstract, interview, status, publisher, average_rating) VALUES (27, '545265355', 'The Hunger Games Box Set', 30, NULL, 'https://images.gr-assets.com/books/1360094673l/7938275.jpg', 'The complete collection of the Hunger Game saga.', NULL, 'Available', 320, NULL);
INSERT INTO public.book (book_id, isbn, title, price, price_currency, picture, abstract, interview, status, publisher, average_rating) VALUES (29, '316206873', 'The Silkworm', 23, NULL, 'https://images.gr-assets.com/books/1392577290l/18214414.jpg', 'The Silkworm is a 2014 crime fiction novel by J. K. Rowling, published under the pseudonym Robert Galbraith. It is the second novel in the Cormoran Strike series of detective novels and was followed by Career of Evil in 2015 and Lethal White in 2018.', NULL, 'Available', 319, NULL);
INSERT INTO public.book (book_id, isbn, title, price, price_currency, picture, abstract, interview, status, publisher, average_rating) VALUES (30, '439321611', 'Quidditch Through the Ages', 48, NULL, 'https://images.gr-assets.com/books/1369689506l/111450.jpg', 'Quidditch Through the Ages is a 2001 book written by British author J. K. Rowling using the pseudonym of Kennilworthy Whisp about Quidditch in the Harry Potter universe. It purports to be the Hogwarts library''s copy of the non-fiction book of the same name mentioned in several novels of the Harry Potter series.', NULL, 'Available', 321, NULL);
INSERT INTO public.book (book_id, isbn, title, price, price_currency, picture, abstract, interview, status, publisher, average_rating) VALUES (31, '345538374', 'The Hobbit and The Lord of the Rings', 31, NULL, 'https://images.gr-assets.com/books/1346072396l/30.jpg', 'The collection of the complete The Lord Of The Ring Saga and The Hobbit.', NULL, 'Available', 320, NULL);
INSERT INTO public.book (book_id, isbn, title, price, price_currency, picture, abstract, interview, status, publisher, average_rating) VALUES (34, '439650763', 'Gregor and the Prophecy of Bane', 34, NULL, 'https://images.gr-assets.com/books/1337457481l/385742.jpg', 'Gregor and the Prophecy of Bane is the second book in Suzanne Collins''s children''s novel series The Underland Chronicles. Published in 2004, the novel contains elements of high fantasy. The novel focuses on a prophecy mentioned at the end of Gregor the Overlander which the Underlanders believe requires the protagonist Gregor to hunt down and kill an evil white rat known as the "Bane". It is told in third person.', NULL, 'Available', 316, NULL);
INSERT INTO public.book (book_id, isbn, title, price, price_currency, picture, abstract, interview, status, publisher, average_rating) VALUES (36, '439791464', 'Gregor and the Marks of Secret', 29, NULL, 'https://images.gr-assets.com/books/1397854344l/319644.jpg', 'Gregor and the Marks of Secret is a high fantasy/epic fantasy novel, the fourth book in the critically acclaimed The Underland Chronicles by Suzanne Collins. It picks up soon after the end of Gregor and the Curse of the Warmbloods.', NULL, 'Available', 316, NULL);
INSERT INTO public.book (book_id, isbn, title, price, price_currency, picture, abstract, interview, status, publisher, average_rating) VALUES (1, '618260307', 'The Hobbit or There and Back Again', 12, NULL, 'https://images.gr-assets.com/books/1372847500l/5907.jpg', 'The Hobbit, or There and Back Again is a children''s fantasy novel by English author J. R. R. Tolkien. It was published on 21 September 1937 to wide critical acclaim, being nominated for the Carnegie Medal and awarded a prize from the New York Herald Tribune for best juvenile fiction. The book remains popular and is recognized as a classic in children''s literature.

The Hobbit is set within Tolkien''s fictional universe and follows the quest of home-loving hobbit Bilbo Baggins to win a share of the treasure guarded by Smaug the dragon. Bilbo''s journey takes him from light-hearted, rural surroundings into more sinister territory.', NULL, 'Available', 320, NULL);
INSERT INTO public.book (book_id, isbn, title, price, price_currency, picture, abstract, interview, status, publisher, average_rating) VALUES (2, '1416524797', 'Angels & Demons ', 40, NULL, 'https://images.gr-assets.com/books/1303390735l/960.jpg', 'Angels & Demons is a 2000 bestselling mystery-thriller novel written by American author Dan Brown and published by Pocket Books and then by Corgi Books. The novel introduces the character Robert Langdon, who recurs as the protagonist of Brown''s subsequent novels. Angels & Demons shares many stylistic literary elements with its sequels, such as conspiracies of secret societies, a single-day time frame, and the Catholic Church. Ancient history, architecture, and symbology are also heavily referenced throughout the book.', NULL, 'Available', 321, NULL);
INSERT INTO public.book (book_id, isbn, title, price, price_currency, picture, abstract, interview, status, publisher, average_rating) VALUES (3, '439023491', 'Catching Fire', 33, NULL, 'https://images.gr-assets.com/books/1358273780l/6148028.jpg', 'Catching Fire is a 2009 science fiction young adult novel by the American novelist Suzanne Collins, the second book in The Hunger Games trilogy. As the sequel to the 2008 bestseller The Hunger Games, it continues the story of Katniss Everdeen and the post-apocalyptic nation of Panem. Following the events of the previous novel, a rebellion against the oppressive Capitol has begun, and Katniss and fellow tribute Peeta Mellark are forced to return to the arena in a special edition of the Hunger Games.

The book was first published on September 1, 2009, by Scholastic, in hardcover, and was later released in ebook and audiobook format. Catching Fire received mostly positive reviews, with reviewers praising Collins'' prose, the book''s ending, and the development of Katniss''s character. According to critics, major themes of the novel include survival, authoritarianism, rebellion and interdependence versus independence. The book has sold more than 19 million copies in the U.S. alone.', NULL, 'Available', 322, NULL);
INSERT INTO public.book (book_id, isbn, title, price, price_currency, picture, abstract, interview, status, publisher, average_rating) VALUES (5, '439139600', 'Harry Potter and the Goblet of Fire', 23, NULL, 'https://images.gr-assets.com/books/1361482611l/6.jpg', 'Harry Potter and the Goblet of Fire is a fantasy book written by British author J. K. Rowling and the fourth novel in the Harry Potter series. It follows Harry Potter, a wizard in his fourth year at Hogwarts School of Witchcraft and Wizardry and the mystery surrounding the entry of Harry''s name into the Triwizard Tournament, in which he is forced to compete.

The book was published in the United Kingdom by Bloomsbury and in the United States by Scholastic; in both countries the release date was 8 July 2000, the first time a book in the series was published in both countries at the same time. The novel won a Hugo Award, the only Harry Potter novel to do so, in 2001. The book was adapted into a film, which was released worldwide on 18 November 2005, and a video game by Electronic Arts.', NULL, 'Available', 317, NULL);
INSERT INTO public.book (book_id, isbn, title, price, price_currency, picture, abstract, interview, status, publisher, average_rating) VALUES (6, '545010225', 'Harry Potter and the Deathly Hallows', 23, NULL, 'https://images.gr-assets.com/books/1474171184l/136251.jpg', 'Harry Potter and the Deathly Hallows is a fantasy novel written by British author J. K. Rowling and the seventh and final novel of the Harry Potter series. The book was released on 21 July 2007, ending the series that began in 1997 with the publication of Harry Potter and the Philosopher''s Stone. It was published in the United Kingdom by Bloomsbury Publishing, in the United States by Scholastic, and in Canada by Raincoast Books. The novel chronicles the events directly following Harry Potter and the Half-Blood Prince (2005) and the final confrontation between the wizards Harry Potter and Lord Voldemort.

Deathly Hallows shattered sales records upon release, surpassing marks set by previous titles of the Harry Potter series. It holds the Guinness World Record for most novels sold within 24 hours of release, with 8.3 million sold in the US alone and 2.65 million in the UK. Generally well received by critics, the book won the 2008 Colorado Blue Spruce Book Award, and the American Library Association named it a "Best Book for Young Adults". A film adaptation of the novel was released in two parts: Harry Potter and the Deathly Hallows – Part 1 in November 2010, and Part 2 in July 2011.', NULL, 'Available', 319, NULL);
INSERT INTO public.book (book_id, isbn, title, price, price_currency, picture, abstract, interview, status, publisher, average_rating) VALUES (7, '618346252', ' The Fellowship of the Ring', 24, NULL, 'https://images.gr-assets.com/books/1298411339l/34.jpg', 'The Fellowship of the Ring is the first of three volumes of the epic novel The Lord of the Rings by the English author J. R. R. Tolkien. It is followed by The Two Towers and The Return of the King. It takes place in the fictional universe of Middle-earth. It was originally published on 29 July 1954 in the United Kingdom.

The volume consists of a foreword, in which the author discusses his writing of The Lord of the Rings, a prologue titled "Concerning Hobbits, and other matters", and the main narrative in Book I and Book II.', NULL, 'Available', 317, NULL);
INSERT INTO public.book (book_id, isbn, title, price, price_currency, picture, abstract, interview, status, publisher, average_rating) VALUES (8, '307277674', 'The Da Vinci Code', 44, NULL, 'https://images.gr-assets.com/books/1303252999l/968.jpg', 'The Da Vinci Code is a 2003 mystery thriller novel by Dan Brown. It is Brown''s second novel to include the character Robert Langdon: the first was his 2000 novel Angels & Demons. The Da Vinci Code follows "symbologist" Robert Langdon and cryptologist Sophie Neveu after a murder in the Louvre Museum in Paris causes them to become involved in a battle between the Priory of Sion and Opus Dei over the possibility of Jesus Christ having been a companion to Mary Magdalene.

The novel explores an alternative religious history, whose central plot point is that the Merovingian kings of France were descended from the bloodline of Jesus Christ and Mary Magdalene, ideas derived from Clive Prince''s The Templar Revelation (1997) and books by Margaret Starbird. The book also refers to The Holy Blood and the Holy Grail (1982) though Dan Brown has stated that it was not used as research material.', NULL, 'Available', 322, NULL);
INSERT INTO public.book (book_id, isbn, title, price, price_currency, picture, abstract, interview, status, publisher, average_rating) VALUES (9, '553588486', 'A Game of Thrones', 12, NULL, 'https://images.gr-assets.com/books/1436732693l/13496.jpg', 'A Game of Thrones is the first novel in A Song of Ice and Fire, a series of fantasy novels by the American author George R. R. Martin. It was first published on August 1, 1996. The novel won the 1997 Locus Award and was nominated for both the 1997 Nebula Award and the 1997 World Fantasy Award. The novella Blood of the Dragon, comprising the Daenerys Targaryen chapters from the novel, won the 1997 Hugo Award for Best Novella. In January 2011, the novel became a New York Times Bestseller and reached #1 on the list in July 2011.

In the novel, recounting events from various points of view, Martin introduces the plot-lines of the noble houses of Westeros, the Wall, and the Targaryens. The novel has inspired several spin-off works, including several games. It is also the namesake and basis for the first season of Game of Thrones, an HBO television series that premiered in April 2011.', NULL, 'Available', 319, NULL);
INSERT INTO public.book (book_id, isbn, title, price, price_currency, picture, abstract, interview, status, publisher, average_rating) VALUES (10, '375826696', 'Eragon', 49, NULL, 'https://images.gr-assets.com/books/1366212852l/113436.jpg', 'Eragon is the first book in The Inheritance Cycle by American fantasy writer, Christopher Paolini. Paolini, born in 1983, wrote the novel while still in his teens. After writing the first draft for a year, Paolini spent a second year rewriting and fleshing out the story and characters. His parents saw the final manuscript and in 2001 decided to self-publish Eragon; Paolini spent a year traveling around the United States promoting the novel. By chance, the book was discovered by Carl Hiaasen, who got it re-published by Alfred A. Knopf. The re-published version was released on August 26, 2003.

The book tells the story of a farm boy named Eragon, who finds a mysterious stone in the mountains. Not knowing the stone''s origin or worth, he attempts to use it as payment to a butcher. A dragon he later names Saphira hatches from the stone, which was really an egg. When the evil King Galbatorix finds out the general location of the egg he sends the Ra''zac to acquire it. By that time Saphira had been growing for a while and takes Eragon to the Spine after Ra''zac appear in their village, Carvahall. Eragon and Saphira are forced to flee from their hometown, with a storyteller called Brom (who is later revealed to be an old member of an extinct group called the Riders), and Brom was supposed to teach Eragon ''The Ways of the Rider''.', NULL, 'Available', 317, NULL);
INSERT INTO public.book (book_id, isbn, title, price, price_currency, picture, abstract, interview, status, publisher, average_rating) VALUES (13, '055357342X', 'A Storm of Swords', 48, NULL, 'https://images.gr-assets.com/books/1497931121l/62291.jpg', 'A Storm of Swords is the third of seven planned novels in A Song of Ice and Fire, a fantasy series by American author George R. R. Martin. It was first published on August 8, 2000, in the United Kingdom, with a United States edition following in November 2000. Its publication was preceded by a novella called Path of the Dragon, which collects some of the Daenerys Targaryen chapters from the novel into a single book.

At the time of its publication, A Storm of Swords was the longest novel in the series. It was so long that in the UK, Ireland, Australia, and Israel, its paperback edition was split in half, Part 1 being published as Steel and Snow in June 2001 (with the one-volume cover) and Part 2 as Blood and Gold in August 2001 (with a specially-commissioned new cover). The same division was used in the Polish and Greek editions. In France, the decision was made to cut the novel into four separate volumes.', NULL, 'Available', 316, NULL);
INSERT INTO public.book (book_id, isbn, title, price, price_currency, picture, abstract, interview, status, publisher, average_rating) VALUES (15, '055358202X', 'A Feast for Crows', 13, NULL, 'https://images.gr-assets.com/books/1429538615l/13497.jpg', 'A Feast for Crows is the fourth of seven planned novels in the epic fantasy series A Song of Ice and Fire by American author George R. R. Martin. The novel was first published on October 17, 2005, in the United Kingdom, with a United States edition following on November 8, 2005.', NULL, 'Available', 316, NULL);
INSERT INTO public.book (book_id, isbn, title, price, price_currency, picture, abstract, interview, status, publisher, average_rating) VALUES (16, '552151696', 'Digital Fortress', 46, NULL, 'https://images.gr-assets.com/books/1360095966l/11125.jpg', 'Digital Fortress is a techno-thriller novel written by American author Dan Brown and published in 1998 by St. Martin''s Press. The book explores the theme of government surveillance of electronically stored information on the private lives of citizens, and the possible civil liberties and ethical implications of using such technology.', NULL, 'Available', 318, NULL);
INSERT INTO public.book (book_id, isbn, title, price, price_currency, picture, abstract, interview, status, publisher, average_rating) VALUES (17, '618640150', 'The Lord of the Rings', 9, NULL, 'https://images.gr-assets.com/books/1411114164l/33.jpg', 'The Lord of the Rings is an epic high fantasy novel written by English author and scholar J. R. R. Tolkien. The story began as a sequel to Tolkien''s 1937 fantasy novel The Hobbit, but eventually developed into a much larger work. Written in stages between 1937 and 1949, The Lord of the Rings is one of the best-selling novels ever written, with over 150 million copies sold.

The title of the novel refers to the story''s main antagonist, the Dark Lord Sauron,[a] who had in an earlier age created the One Ring to rule the other Rings of Power as the ultimate weapon in his campaign to conquer and rule all of Middle-earth. From quiet beginnings in the Shire, a hobbit land not unlike the English countryside, the story ranges across Middle-earth, following the course of the War of the Ring through the eyes of its characters, most notably the hobbits Frodo Baggins, Sam, Merry and Pippin.', NULL, 'Available', 319, NULL);
INSERT INTO public.book (book_id, isbn, title, price, price_currency, picture, abstract, interview, status, publisher, average_rating) VALUES (19, '385504225', 'The Lost Symbol', 22, NULL, 'https://images.gr-assets.com/books/1358274396l/6411961.jpg', 'The Lost Symbol is a 2009 novel written by American writer Dan Brown. It is a thriller set in Washington, D.C., after the events of The Da Vinci Code, and relies on Freemasonry for both its recurring theme and its major characters.

Released on September 15, 2009, it is the third Brown novel to involve the character of Harvard University symbologist Robert Langdon, following 2000''s Angels & Demons and 2003''s The Da Vinci Code.', NULL, 'Available', 321, NULL);
INSERT INTO public.book (book_id, isbn, title, price, price_currency, picture, abstract, interview, status, publisher, average_rating) VALUES (20, '385537859', 'Inferno', 10, NULL, 'https://images.gr-assets.com/books/1397093185l/17212231.jpg', 'Inferno is a 2013 mystery thriller novel by American author Dan Brown and the fourth book in his Robert Langdon series, following Angels & Demons, The Da Vinci Code and The Lost Symbol. The book was published on May 14, 2013, ten years after publication of The Da Vinci Code (2003), by Doubleday. It was number one on the New York Times Best Seller list for hardcover fiction and Combined Print & E-book fiction for the first eleven weeks of its release, and also remained on the list of E-book fiction for the first seventeen weeks of its release.', NULL, 'Available', 316, NULL);
INSERT INTO public.book (book_id, isbn, title, price, price_currency, picture, abstract, interview, status, publisher, average_rating) VALUES (37, '097640110X', 'The Hedge Knight', 28, NULL, 'https://images.gr-assets.com/books/1443806558l/13501.jpg', 'The first novella was originally published August 25, 1998 in the Legends anthology, edited by Robert Silverberg. The story was later adapted into a six-issue comic book limited series by Ben Avery, drawn by Mike S. Miller, produced by Roaring Studios (now Dabel Brothers Productions) and published by Image Comics and Devil''s Due between August 2003 and May 2004. Devil''s Due published the complete limited series as a graphic novel in June 2004. Following the termination of the partnership between Dabel Brothers and Devil''s Due, the graphic novel has been republished in various editions.', NULL, 'Available', 322, NULL);
INSERT INTO public.book (book_id, isbn, title, price, price_currency, picture, abstract, interview, status, publisher, average_rating) VALUES (38, '553805444', 'The World of Ice and Fire', 44, NULL, 'https://images.gr-assets.com/books/1400360220l/17345242.jpg', 'The World of Ice & Fire is a companion book for George R. R. Martin''s A Song of Ice and Fire fantasy series. Written by Martin, Elio M. García Jr. and Linda Antonsson, it was published by Bantam on October 28, 2014. The 326-page volume is a fully illustrated "history compendium" of Martin''s fictional Westeros, written from the perspective of an in-world "Maester" and featuring newly written material, family trees, and extensive maps and artwork.', NULL, 'Available', 318, NULL);
INSERT INTO public.book (book_id, isbn, title, price, price_currency, picture, abstract, interview, status, publisher, average_rating) VALUES (22, '747599874', 'The Tales of Beedle the Bard', 31, NULL, 'https://images.gr-assets.com/books/1373467575l/3950967.jpg', 'The Tales of Beedle the Bard is a book of children''s stories by British author J. K. Rowling. There is a storybook of the same name mentioned in Harry Potter and the Deathly Hallows, the last book of the Harry Potter series.

The book was originally produced in a limited edition of only seven copies, each handwritten and illustrated by J. K. Rowling. One of them was offered for auction through Sotheby''s in late 2007 and was expected to sell for £50,000 (US$77,000, €69,000); ultimately it was bought for £1.95 million ($3 million, €2.7 million) by Amazon, making the selling price the highest achieved at auction for a modern literary manuscript. The money earned at the auction of the book was donated to The Children''s Voice charity campaign.', NULL, 'Available', 320, NULL);
INSERT INTO public.book (book_id, isbn, title, price, price_currency, picture, abstract, interview, status, publisher, average_rating) VALUES (23, '375840400', 'Eldest', 43, NULL, 'https://images.gr-assets.com/books/1387119654l/45978.jpg', 'Eldest is the second novel in the Inheritance Cycle by Christopher Paolini and the sequel to Eragon. Eldest was first published in hardcover on August 23, 2005, and was released in paperback in September 2006.[1] Eldest has been released in an audiobook format,[2] and as an ebook.[3] Like Eragon, Eldest became a New York Times bestseller.[3] A deluxe edition of Eldest was released on September 26, 2006, including new information and art by both the illustrator and the author. Other editions of Eldest are translated into different languages.

Eldest begins following several important events in Eragon. The story is the continued adventures of Eragon and his dragon Saphira, centering on their journey to the realm of the Elves in order to further Eragon''s training as a Dragon Rider. Other plots in the story focus on Roran, Eragon''s cousin, who leads the inhabitants of Carvahall to Surda to join the Varden, and Nasuada as she takes on her father''s role as leader of the Varden. Eldest ends at the Battle of the Burning Plains, where Eragon faces a new Dragon Rider, Murtagh, and a new dragon, Thorn.', NULL, 'Available', 322, NULL);
INSERT INTO public.book (book_id, isbn, title, price, price_currency, picture, abstract, interview, status, publisher, average_rating) VALUES (24, '316228532', 'The Casual Vacancy', 10, NULL, 'https://images.gr-assets.com/books/1358266832l/13497818.jpg', 'The Casual Vacancy is a 2012 novel written by J. K. Rowling. The book was published worldwide by the Little, Brown Book Group on 27 September 2012. A paperback edition was released on 23 July 2013. It was Rowling''s first publication since the Harry Potter series, her first apart from that series, and her first novel for adult readership.

The novel is set in a suburban West Country town called Pagford and begins with the death of beloved Parish Councillor Barry Fairbrother. Subsequently, a seat on the council is vacant and a conflict ensues before the election for his successor takes place. Factions develop, particularly concerning whether to dissociate with a local council estate, ''the Fields'', with which Barry supported an alliance. However, those running for a place soon find their darkest secrets revealed on the Parish Council online forum, ruining their campaign and leaving the election in turmoil.', NULL, 'Available', 321, NULL);
INSERT INTO public.book (book_id, isbn, title, price, price_currency, picture, abstract, interview, status, publisher, average_rating) VALUES (26, '618391118', 'The Silmarillion', 21, NULL, 'https://images.gr-assets.com/books/1336502583l/7332.jpg', 'The Silmarillion (Quenya: [silmaˈriliɔn]) is a collection of mythopoeic works by English writer J. R. R. Tolkien, edited and published posthumously by his son, Christopher Tolkien, in 1977, with assistance from Guy Gavriel Kay. The Silmarillion, along with J. R. R. Tolkien''s other works, forms an extensive, though incomplete, narrative that describes the universe of Eä in which are found the lands of Valinor, Beleriand, Númenor, and Middle-earth, within which The Hobbit and The Lord of the Rings take place.

After the success of The Hobbit, Tolkien''s publisher requested a sequel. Tolkien sent them an early draft of The Silmarillion but they rejected the work as being obscure and "too Celtic". The result was that Tolkien began work on "A Long Expected Party", the first chapter of what he described at the time as "a new story about Hobbits", which became The Lord of the Rings.', NULL, 'Available', 318, NULL);
INSERT INTO public.book (book_id, isbn, title, price, price_currency, picture, abstract, interview, status, publisher, average_rating) VALUES (28, '345368584', 'The Hobbit', 34, NULL, 'https://images.gr-assets.com/books/1374681632l/659469.jpg', 'The Hobbit, or There and Back Again is a children''s fantasy novel by English author J. R. R. Tolkien. It was published on 21 September 1937 to wide critical acclaim, being nominated for the Carnegie Medal and awarded a prize from the New York Herald Tribune for best juvenile fiction. The book remains popular and is recognized as a classic in children''s literature.

The Hobbit is set within Tolkien''s fictional universe and follows the quest of home-loving hobbit Bilbo Baggins to win a share of the treasure guarded by Smaug the dragon. Bilbo''s journey takes him from light-hearted, rural surroundings into more sinister territory.

The story is told in the form of an episodic quest, and most chapters introduce a specific creature or type of creature of Tolkien''s geography. Bilbo gains a new level of maturity, competence, and wisdom by accepting the disreputable, romantic, fey, and adventurous sides of his nature and applying his wits and common sense. The story reaches its climax in the Battle of the Five Armies, where many of the characters and creatures from earlier chapters re-emerge to engage in conflict.', NULL, 'Available', 319, NULL);
INSERT INTO public.book (book_id, isbn, title, price, price_currency, picture, abstract, interview, status, publisher, average_rating) VALUES (32, '1780484259', 'A Song of Ice and Fire', 16, NULL, 'https://images.gr-assets.com/books/1339340118l/12177850.jpg', 'A Song of Ice and Fire is a series of epic fantasy novels by the American novelist and screenwriter George R. R. Martin. He began the first volume of the series, A Game of Thrones, in 1991, and it was published in 1996. Martin, who initially envisioned the series as a trilogy, has published five out of a planned seven volumes. The fifth and most recent volume of the series, A Dance with Dragons, was published in 2011 and took Martin six years to write. He is currently writing the sixth novel, The Winds of Winter.', NULL, 'Available', 320, NULL);
INSERT INTO public.book (book_id, isbn, title, price, price_currency, picture, abstract, interview, status, publisher, average_rating) VALUES (33, '043979143X', 'Gregor and the Code of Claw', 46, NULL, 'https://images.gr-assets.com/books/1365854331l/537070.jpg', 'Gregor and the Code of Claw is a children''s novel by author Suzanne Collins, best known for her Hunger Games trilogy. It is the fifth and final book of The Underland Chronicles, and was published in 2007. Scholastic has rated the book''s "grade level equivalent" as 4.5 and the book''s lexile score as 730L, making it reading-level-appropriate for the average fourth to sixth grader. The novel has been praised especially as a conclusion to The Underland Chronicles. In its description of the novel, as part of its "Recommended Books" award, the CCBC states, "Although Gregor and the Code of Claw works as a stand-alone story, readers will want to start with book one and work their way through to this final volume." An audiobook version was released in 2008, read by Paul Boehmer.', NULL, 'Available', 319, NULL);
INSERT INTO public.book (book_id, isbn, title, price, price_currency, picture, abstract, interview, status, publisher, average_rating) VALUES (35, '345533488', 'A Knight of the Seven Kingdoms', 20, NULL, 'https://images.gr-assets.com/books/1423281810l/18635622.jpg', 'Tales of Dunk and Egg is a series of fantasy novellas by George R. R. Martin, set in the world of his A Song of Ice and Fire novels. They follow the adventures of "Dunk" (the future Lord Commander of the Kingsguard, Ser Duncan the Tall) and "Egg" (the future king Aegon V Targaryen), some 90 years before the events of the novels.', NULL, 'Available', 318, NULL);


--
-- TOC entry 3393 (class 0 OID 41600)
-- Dependencies: 204
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
-- TOC entry 3395 (class 0 OID 41605)
-- Dependencies: 206
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
-- TOC entry 3397 (class 0 OID 41610)
-- Dependencies: 208
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
-- TOC entry 3398 (class 0 OID 41614)
-- Dependencies: 209
-- Data for Name: cart_book; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- TOC entry 3401 (class 0 OID 41622)
-- Dependencies: 212
-- Data for Name: event; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.event (event_id, location, book, name, date_time) VALUES (3, 11, 3, 'Catching Fire', '2019-07-13 12:00:00+02');
INSERT INTO public.event (event_id, location, book, name, date_time) VALUES (4, 11, 6, 'Harry Potter and the Deathly Hallows', '2019-08-31 14:00:00+02');
INSERT INTO public.event (event_id, location, book, name, date_time) VALUES (5, 11, 8, 'The Da Vinci Code', '2019-09-03 20:30:00+02');
INSERT INTO public.event (event_id, location, book, name, date_time) VALUES (6, 11, 10, 'Eragon', '2019-10-05 18:00:00+02');
INSERT INTO public.event (event_id, location, book, name, date_time) VALUES (7, 11, 26, 'The Silmarillon', '2019-11-11 10:00:00+01');


--
-- TOC entry 3403 (class 0 OID 41627)
-- Dependencies: 214
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
-- TOC entry 3405 (class 0 OID 41635)
-- Dependencies: 216
-- Data for Name: order; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."order" (order_id, user_id, shipment_address, shipping_method, payment_method, cart, order_date) VALUES (1, 1, 7, 'Delivery', 'PayPal', 1, '2019-07-03 23:02:12.238+02');
INSERT INTO public."order" (order_id, user_id, shipment_address, shipping_method, payment_method, cart, order_date) VALUES (2, 1, 8, 'Delivery', 'PayPal', 1, '2019-07-03 23:02:12.249+02');
INSERT INTO public."order" (order_id, user_id, shipment_address, shipping_method, payment_method, cart, order_date) VALUES (3, 1, 9, 'Delivery', 'Bank Transfer', 5, '2019-07-03 23:07:12.083+02');
INSERT INTO public."order" (order_id, user_id, shipment_address, shipping_method, payment_method, cart, order_date) VALUES (4, 1, 10, 'Delivery', 'PayPal', 6, '2019-07-04 09:46:22.544+02');


--
-- TOC entry 3407 (class 0 OID 41649)
-- Dependencies: 218
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
-- TOC entry 3409 (class 0 OID 41662)
-- Dependencies: 220
-- Data for Name: review; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- TOC entry 3411 (class 0 OID 41670)
-- Dependencies: 222
-- Data for Name: similar_book; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.similar_book (id, book1, book2) VALUES (2, 0, 3);
INSERT INTO public.similar_book (id, book1, book2) VALUES (5, 0, 4);
INSERT INTO public.similar_book (id, book1, book2) VALUES (6, 3, 4);
INSERT INTO public.similar_book (id, book1, book2) VALUES (7, 2, 8);
INSERT INTO public.similar_book (id, book1, book2) VALUES (8, 2, 20);
INSERT INTO public.similar_book (id, book1, book2) VALUES (9, 2, 19);
INSERT INTO public.similar_book (id, book1, book2) VALUES (10, 19, 20);
INSERT INTO public.similar_book (id, book1, book2) VALUES (11, 19, 8);
INSERT INTO public.similar_book (id, book1, book2) VALUES (12, 8, 20);
INSERT INTO public.similar_book (id, book1, book2) VALUES (14, 1, 12);
INSERT INTO public.similar_book (id, book1, book2) VALUES (15, 1, 14);
INSERT INTO public.similar_book (id, book1, book2) VALUES (16, 1, 17);
INSERT INTO public.similar_book (id, book1, book2) VALUES (17, 1, 28);
INSERT INTO public.similar_book (id, book1, book2) VALUES (22, 12, 14);
INSERT INTO public.similar_book (id, book1, book2) VALUES (23, 12, 17);
INSERT INTO public.similar_book (id, book1, book2) VALUES (24, 12, 28);
INSERT INTO public.similar_book (id, book1, book2) VALUES (25, 14, 17);
INSERT INTO public.similar_book (id, book1, book2) VALUES (26, 14, 28);
INSERT INTO public.similar_book (id, book1, book2) VALUES (27, 17, 28);
INSERT INTO public.similar_book (id, book1, book2) VALUES (13, 1, 7);
INSERT INTO public.similar_book (id, book1, book2) VALUES (18, 7, 12);
INSERT INTO public.similar_book (id, book1, book2) VALUES (19, 7, 14);
INSERT INTO public.similar_book (id, book1, book2) VALUES (20, 7, 17);
INSERT INTO public.similar_book (id, book1, book2) VALUES (21, 7, 28);
INSERT INTO public.similar_book (id, book1, book2) VALUES (28, 5, 6);
INSERT INTO public.similar_book (id, book1, book2) VALUES (29, 5, 25);
INSERT INTO public.similar_book (id, book1, book2) VALUES (30, 6, 25);
INSERT INTO public.similar_book (id, book1, book2) VALUES (31, 5, 30);
INSERT INTO public.similar_book (id, book1, book2) VALUES (32, 6, 30);
INSERT INTO public.similar_book (id, book1, book2) VALUES (33, 25, 30);
INSERT INTO public.similar_book (id, book1, book2) VALUES (34, 33, 34);
INSERT INTO public.similar_book (id, book1, book2) VALUES (35, 33, 36);
INSERT INTO public.similar_book (id, book1, book2) VALUES (36, 34, 36);
INSERT INTO public.similar_book (id, book1, book2) VALUES (37, 10, 23);
INSERT INTO public.similar_book (id, book1, book2) VALUES (38, 9, 11);
INSERT INTO public.similar_book (id, book1, book2) VALUES (39, 9, 13);
INSERT INTO public.similar_book (id, book1, book2) VALUES (40, 9, 15);
INSERT INTO public.similar_book (id, book1, book2) VALUES (41, 9, 18);
INSERT INTO public.similar_book (id, book1, book2) VALUES (42, 9, 32);
INSERT INTO public.similar_book (id, book1, book2) VALUES (43, 9, 35);
INSERT INTO public.similar_book (id, book1, book2) VALUES (44, 11, 13);
INSERT INTO public.similar_book (id, book1, book2) VALUES (45, 11, 15);
INSERT INTO public.similar_book (id, book1, book2) VALUES (46, 11, 18);
INSERT INTO public.similar_book (id, book1, book2) VALUES (47, 11, 32);
INSERT INTO public.similar_book (id, book1, book2) VALUES (48, 11, 35);
INSERT INTO public.similar_book (id, book1, book2) VALUES (49, 13, 15);
INSERT INTO public.similar_book (id, book1, book2) VALUES (50, 13, 18);
INSERT INTO public.similar_book (id, book1, book2) VALUES (51, 13, 32);
INSERT INTO public.similar_book (id, book1, book2) VALUES (52, 13, 35);
INSERT INTO public.similar_book (id, book1, book2) VALUES (53, 15, 18);
INSERT INTO public.similar_book (id, book1, book2) VALUES (54, 15, 32);
INSERT INTO public.similar_book (id, book1, book2) VALUES (55, 15, 35);
INSERT INTO public.similar_book (id, book1, book2) VALUES (56, 18, 32);
INSERT INTO public.similar_book (id, book1, book2) VALUES (57, 18, 35);
INSERT INTO public.similar_book (id, book1, book2) VALUES (58, 32, 35);
INSERT INTO public.similar_book (id, book1, book2) VALUES (59, 26, 7);
INSERT INTO public.similar_book (id, book1, book2) VALUES (60, 26, 12);
INSERT INTO public.similar_book (id, book1, book2) VALUES (61, 26, 14);
INSERT INTO public.similar_book (id, book1, book2) VALUES (62, 26, 17);
INSERT INTO public.similar_book (id, book1, book2) VALUES (63, 26, 28);


--
-- TOC entry 3413 (class 0 OID 41675)
-- Dependencies: 224
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
-- TOC entry 3415 (class 0 OID 41683)
-- Dependencies: 226
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."user" (user_id, username, password, email, first_name, surname, birth_date, address, time_registered) VALUES (2, 'malta', '$2b$10$AQk/BPKfG7TCAM/EOIEVoup5a44xE21GypNSXuIjt9YlcR9DD7y7e', 'dsaf@sdaf.it', 'tygui', 'vvyuijo', '2019-07-04', NULL, NULL);
INSERT INTO public."user" (user_id, username, password, email, first_name, surname, birth_date, address, time_registered) VALUES (1, 'malta95', '$2b$10$eThIBRkFe0MSC4cYaJOKv.UvwT4EDDuRpwbTlVSKTVZ.DwOknrIN6', 'malta95@hotmail.it', 'Luca', 'Maltagliati', '1995-08-29', 3, NULL);
INSERT INTO public."user" (user_id, username, password, email, first_name, surname, birth_date, address, time_registered) VALUES (3, 'fabmas', '$2b$10$S8kEo8r/zmfjH17KbDqduuz3Mu5x9.vyynD.X7nP6ouM345uVgYCm', 'fabmas@gmail.com', 'Fabio', 'Masciopinto', '1992-02-29', NULL, NULL);
INSERT INTO public."user" (user_id, username, password, email, first_name, surname, birth_date, address, time_registered) VALUES (4, 'sadf', '$2b$10$1/QnhUAKFO8D23SRlNQtpetiWvoVNBzFeZN.pqqFAPwpW7MJ9zAaW', 'ciao@email.it', 'BElla', 'ciao', '2019-06-27', NULL, NULL);
INSERT INTO public."user" (user_id, username, password, email, first_name, surname, birth_date, address, time_registered) VALUES (5, 'mab', '$2b$10$q/JydJ0y8Z8DoB1eC1zFu.r71k/Xr6IBMZwbL4NBasl1vX4OUUDtG', 'mab@das.it', 'Mario', 'Bianci', '2019-07-20', NULL, NULL);


--
-- TOC entry 3438 (class 0 OID 0)
-- Dependencies: 197
-- Name: address_address_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.address_address_id_seq', 11, true);


--
-- TOC entry 3439 (class 0 OID 0)
-- Dependencies: 199
-- Name: author_author_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.author_author_id_seq', 1895, true);


--
-- TOC entry 3440 (class 0 OID 0)
-- Dependencies: 201
-- Name: author_book_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.author_book_id_seq', 2310, true);


--
-- TOC entry 3441 (class 0 OID 0)
-- Dependencies: 203
-- Name: book_book_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.book_book_id_seq', 1, false);


--
-- TOC entry 3442 (class 0 OID 0)
-- Dependencies: 205
-- Name: book_genre_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.book_genre_id_seq', 3357, true);


--
-- TOC entry 3443 (class 0 OID 0)
-- Dependencies: 207
-- Name: book_theme_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.book_theme_id_seq', 3416, true);


--
-- TOC entry 3444 (class 0 OID 0)
-- Dependencies: 210
-- Name: cart_book_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.cart_book_id_seq', 40, true);


--
-- TOC entry 3445 (class 0 OID 0)
-- Dependencies: 211
-- Name: cart_cart_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.cart_cart_id_seq', 9, true);


--
-- TOC entry 3446 (class 0 OID 0)
-- Dependencies: 213
-- Name: event_event_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.event_event_id_seq', 7, true);


--
-- TOC entry 3447 (class 0 OID 0)
-- Dependencies: 215
-- Name: genre_genre_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.genre_genre_id_seq', 506, true);


--
-- TOC entry 3448 (class 0 OID 0)
-- Dependencies: 217
-- Name: order_order_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.order_order_id_seq', 4, true);


--
-- TOC entry 3449 (class 0 OID 0)
-- Dependencies: 219
-- Name: publisher_publisher_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.publisher_publisher_id_seq', 322, true);


--
-- TOC entry 3450 (class 0 OID 0)
-- Dependencies: 221
-- Name: review_review_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.review_review_id_seq', 1, false);


--
-- TOC entry 3451 (class 0 OID 0)
-- Dependencies: 223
-- Name: similar_book_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.similar_book_id_seq', 63, true);


--
-- TOC entry 3452 (class 0 OID 0)
-- Dependencies: 225
-- Name: theme_theme_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.theme_theme_id_seq', 552, true);


--
-- TOC entry 3453 (class 0 OID 0)
-- Dependencies: 227
-- Name: user_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.user_user_id_seq', 5, true);


--
-- TOC entry 3184 (class 2606 OID 41708)
-- Name: address address_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.address
    ADD CONSTRAINT address_pkey PRIMARY KEY (address_id);


--
-- TOC entry 3188 (class 2606 OID 41710)
-- Name: author_book author_book_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.author_book
    ADD CONSTRAINT author_book_pkey PRIMARY KEY (id);


--
-- TOC entry 3186 (class 2606 OID 41712)
-- Name: author author_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.author
    ADD CONSTRAINT author_pkey PRIMARY KEY (author_id);


--
-- TOC entry 3222 (class 2606 OID 41714)
-- Name: similar_book book1_book2_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.similar_book
    ADD CONSTRAINT book1_book2_unique UNIQUE (book1, book2);


--
-- TOC entry 3190 (class 2606 OID 41716)
-- Name: author_book book_author_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.author_book
    ADD CONSTRAINT book_author_unique UNIQUE (book, author);


--
-- TOC entry 3196 (class 2606 OID 41718)
-- Name: book_genre book_genre_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.book_genre
    ADD CONSTRAINT book_genre_pkey PRIMARY KEY (id);


--
-- TOC entry 3198 (class 2606 OID 41720)
-- Name: book_genre book_genre_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.book_genre
    ADD CONSTRAINT book_genre_unique UNIQUE (book, genre);


--
-- TOC entry 3192 (class 2606 OID 41722)
-- Name: book book_isbn_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.book
    ADD CONSTRAINT book_isbn_unique UNIQUE (isbn);


--
-- TOC entry 3194 (class 2606 OID 41724)
-- Name: book book_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.book
    ADD CONSTRAINT book_pkey PRIMARY KEY (book_id);


--
-- TOC entry 3200 (class 2606 OID 41726)
-- Name: book_theme book_theme_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.book_theme
    ADD CONSTRAINT book_theme_pkey PRIMARY KEY (id);


--
-- TOC entry 3202 (class 2606 OID 41728)
-- Name: book_theme book_theme_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.book_theme
    ADD CONSTRAINT book_theme_unique UNIQUE (book, theme);


--
-- TOC entry 3206 (class 2606 OID 41730)
-- Name: cart_book cart_book_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cart_book
    ADD CONSTRAINT cart_book_pkey PRIMARY KEY (id);


--
-- TOC entry 3208 (class 2606 OID 41732)
-- Name: cart_book cart_book_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cart_book
    ADD CONSTRAINT cart_book_unique UNIQUE (cart, book);


--
-- TOC entry 3204 (class 2606 OID 41734)
-- Name: cart cart_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cart
    ADD CONSTRAINT cart_pkey PRIMARY KEY (cart_id);


--
-- TOC entry 3210 (class 2606 OID 41736)
-- Name: event event_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.event
    ADD CONSTRAINT event_pkey PRIMARY KEY (event_id);


--
-- TOC entry 3212 (class 2606 OID 41738)
-- Name: genre genre_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.genre
    ADD CONSTRAINT genre_pkey PRIMARY KEY (genre_id);


--
-- TOC entry 3214 (class 2606 OID 41740)
-- Name: order order_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."order"
    ADD CONSTRAINT order_pkey PRIMARY KEY (order_id);


--
-- TOC entry 3216 (class 2606 OID 41742)
-- Name: publisher publisher_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.publisher
    ADD CONSTRAINT publisher_pkey PRIMARY KEY (publisher_id);


--
-- TOC entry 3218 (class 2606 OID 41744)
-- Name: review review_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.review
    ADD CONSTRAINT review_pkey PRIMARY KEY (review_id);


--
-- TOC entry 3224 (class 2606 OID 41746)
-- Name: similar_book similar_book_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.similar_book
    ADD CONSTRAINT similar_book_pkey PRIMARY KEY (id);


--
-- TOC entry 3226 (class 2606 OID 41748)
-- Name: theme theme_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.theme
    ADD CONSTRAINT theme_pkey PRIMARY KEY (theme_id);


--
-- TOC entry 3220 (class 2606 OID 41750)
-- Name: review user_book_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.review
    ADD CONSTRAINT user_book_unique UNIQUE ("user", book);


--
-- TOC entry 3228 (class 2606 OID 41752)
-- Name: user user_email_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_email_unique UNIQUE (email);


--
-- TOC entry 3230 (class 2606 OID 41754)
-- Name: user user_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (user_id);


--
-- TOC entry 3232 (class 2606 OID 41756)
-- Name: user user_username_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_username_unique UNIQUE (username);


--
-- TOC entry 3383 (class 2618 OID 41975)
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
-- TOC entry 3384 (class 2618 OID 41980)
-- Name: order_essentials _RETURN; Type: RULE; Schema: public; Owner: -
--

CREATE OR REPLACE VIEW public.order_essentials AS
 SELECT o.order_id,
    "user".user_id,
    o.payment_method,
    o.shipping_method,
    o.order_date,
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
-- TOC entry 3258 (class 2620 OID 41759)
-- Name: user create_cart_trig; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER create_cart_trig AFTER INSERT ON public."user" FOR EACH ROW EXECUTE PROCEDURE public.create_cart();


--
-- TOC entry 3254 (class 2620 OID 41760)
-- Name: cart_book delete_on_zero_quantity; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER delete_on_zero_quantity AFTER UPDATE OF quantity ON public.cart_book FOR EACH ROW WHEN ((new.quantity <= 0)) EXECUTE PROCEDURE public.delete_cart_zero_quantity();


--
-- TOC entry 3256 (class 2620 OID 41761)
-- Name: review update_avg_rating_d; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_avg_rating_d AFTER DELETE ON public.review FOR EACH ROW EXECUTE PROCEDURE public.update_average_rating_old();


--
-- TOC entry 3257 (class 2620 OID 41762)
-- Name: review update_avg_rating_iu; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_avg_rating_iu AFTER INSERT OR UPDATE OF rating ON public.review FOR EACH ROW EXECUTE PROCEDURE public.update_average_rating_new();


--
-- TOC entry 3255 (class 2620 OID 41763)
-- Name: order update_cart_after_insert; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_cart_after_insert AFTER INSERT ON public."order" FOR EACH ROW EXECUTE PROCEDURE public.update_cart_on_order();


--
-- TOC entry 3233 (class 2606 OID 41764)
-- Name: author_book author_book_author_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.author_book
    ADD CONSTRAINT author_book_author_foreign FOREIGN KEY (author) REFERENCES public.author(author_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3234 (class 2606 OID 41769)
-- Name: author_book author_book_book_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.author_book
    ADD CONSTRAINT author_book_book_foreign FOREIGN KEY (book) REFERENCES public.book(book_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3236 (class 2606 OID 41774)
-- Name: book_genre book_genre_book_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.book_genre
    ADD CONSTRAINT book_genre_book_foreign FOREIGN KEY (book) REFERENCES public.book(book_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3237 (class 2606 OID 41779)
-- Name: book_genre book_genre_genre_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.book_genre
    ADD CONSTRAINT book_genre_genre_foreign FOREIGN KEY (genre) REFERENCES public.genre(genre_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3235 (class 2606 OID 41784)
-- Name: book book_publisher_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.book
    ADD CONSTRAINT book_publisher_foreign FOREIGN KEY (publisher) REFERENCES public.publisher(publisher_id);


--
-- TOC entry 3238 (class 2606 OID 41789)
-- Name: book_theme book_theme_book_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.book_theme
    ADD CONSTRAINT book_theme_book_foreign FOREIGN KEY (book) REFERENCES public.book(book_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3239 (class 2606 OID 41794)
-- Name: book_theme book_theme_theme_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.book_theme
    ADD CONSTRAINT book_theme_theme_foreign FOREIGN KEY (theme) REFERENCES public.theme(theme_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3241 (class 2606 OID 41799)
-- Name: cart_book cart_book_book_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cart_book
    ADD CONSTRAINT cart_book_book_foreign FOREIGN KEY (book) REFERENCES public.book(book_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3242 (class 2606 OID 41804)
-- Name: cart_book cart_book_cart_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cart_book
    ADD CONSTRAINT cart_book_cart_foreign FOREIGN KEY (cart) REFERENCES public.cart(cart_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3240 (class 2606 OID 41809)
-- Name: cart cart_user_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cart
    ADD CONSTRAINT cart_user_foreign FOREIGN KEY ("user") REFERENCES public."user"(user_id);


--
-- TOC entry 3243 (class 2606 OID 41814)
-- Name: event event_book_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.event
    ADD CONSTRAINT event_book_foreign FOREIGN KEY (book) REFERENCES public.book(book_id);


--
-- TOC entry 3244 (class 2606 OID 41819)
-- Name: event event_location_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.event
    ADD CONSTRAINT event_location_foreign FOREIGN KEY (location) REFERENCES public.address(address_id);


--
-- TOC entry 3245 (class 2606 OID 41824)
-- Name: order order_cart_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."order"
    ADD CONSTRAINT order_cart_foreign FOREIGN KEY (cart) REFERENCES public.cart(cart_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3246 (class 2606 OID 41829)
-- Name: order order_shipment_address_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."order"
    ADD CONSTRAINT order_shipment_address_foreign FOREIGN KEY (shipment_address) REFERENCES public.address(address_id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3247 (class 2606 OID 41834)
-- Name: order order_user_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."order"
    ADD CONSTRAINT order_user_id_foreign FOREIGN KEY (user_id) REFERENCES public."user"(user_id) ON UPDATE CASCADE;


--
-- TOC entry 3248 (class 2606 OID 41839)
-- Name: publisher publisher_hq_location_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.publisher
    ADD CONSTRAINT publisher_hq_location_foreign FOREIGN KEY (hq_location) REFERENCES public.address(address_id);


--
-- TOC entry 3249 (class 2606 OID 41844)
-- Name: review review_book_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.review
    ADD CONSTRAINT review_book_foreign FOREIGN KEY (book) REFERENCES public.book(book_id);


--
-- TOC entry 3250 (class 2606 OID 41849)
-- Name: review review_user_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.review
    ADD CONSTRAINT review_user_foreign FOREIGN KEY ("user") REFERENCES public."user"(user_id);


--
-- TOC entry 3251 (class 2606 OID 41854)
-- Name: similar_book similar_book_book1_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.similar_book
    ADD CONSTRAINT similar_book_book1_foreign FOREIGN KEY (book1) REFERENCES public.book(book_id);


--
-- TOC entry 3252 (class 2606 OID 41859)
-- Name: similar_book similar_book_book2_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.similar_book
    ADD CONSTRAINT similar_book_book2_foreign FOREIGN KEY (book2) REFERENCES public.book(book_id);


--
-- TOC entry 3253 (class 2606 OID 41864)
-- Name: user user_address_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_address_foreign FOREIGN KEY (address) REFERENCES public.address(address_id) ON UPDATE CASCADE ON DELETE SET NULL;


-- Completed on 2019-07-04 22:56:38 CEST

--
-- PostgreSQL database dump complete
--

