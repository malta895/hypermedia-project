-- View: public.author_essential

DROP VIEW IF EXISTS public.author_essential CASCADE;

CREATE OR REPLACE VIEW public.author_essential AS
SELECT author.author_id,
author.name,
author.picture
FROM author;

ALTER TABLE public.author_essential
OWNER TO CURRENT_USER;

-- View: public.publisher_complete

DROP VIEW IF EXISTS public.publisher_complete CASCADE;

CREATE OR REPLACE VIEW public.publisher_complete AS
SELECT publisher.publisher_id,
publisher.name,
to_jsonb(ad.*) AS hq_address
FROM publisher
LEFT JOIN address ad ON ad.address_id = publisher.hq_location;

ALTER TABLE public.publisher_complete
OWNER TO CURRENT_USER;


-- View: public.publisher_essential

DROP VIEW IF EXISTS public.publisher_essential CASCADE;

CREATE OR REPLACE VIEW public.publisher_essential AS
SELECT publisher.publisher_id,
publisher.name
FROM publisher;

ALTER TABLE public.publisher_essential
OWNER TO CURRENT_USER;



-- View: public.book_essentials

DROP VIEW IF EXISTS public.book_essentials CASCADE;

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
FROM book b
LEFT JOIN publisher_essential pu ON b.publisher = pu.publisher_id
LEFT JOIN book_genre bg ON bg.book = b.book_id
LEFT JOIN genre ge ON bg.genre = ge.genre_id
LEFT JOIN book_theme bt ON bt.book = b.book_id
LEFT JOIN theme th ON th.theme_id = bt.theme
LEFT JOIN author_book ab ON ab.book = b.book_id
LEFT JOIN author_essential au ON au.author_id = ab.author
GROUP BY b.book_id, pu.*;

ALTER TABLE public.book_essentials
OWNER TO CURRENT_USER;


-- View: public.order_essentials

DROP VIEW IF EXISTS public.order_essentials;

CREATE OR REPLACE VIEW public.order_essentials AS
SELECT o.order_id,
"user".user_id,
o.payment_method,
o.shipping_method,
o.order_date,
to_jsonb(ad.*) AS shipment_address,
sum(b.price * cb.quantity::double precision) AS total_amount,
jsonb_agg(jsonb_build_object('book', b.*, 'quantity', cb.quantity)) AS books
FROM "order" o
LEFT JOIN address ad ON ad.address_id = o.shipment_address
LEFT JOIN cart ON o.cart = cart.cart_id
LEFT JOIN cart_book cb ON cb.cart = cart.cart_id
LEFT JOIN book_essentials b ON b.book_id = cb.book
LEFT JOIN "user" ON cart."user" = "user".user_id
GROUP BY "user".user_id, o.order_id, ad.*;

ALTER TABLE public.order_essentials
OWNER TO CURRENT_USER;
