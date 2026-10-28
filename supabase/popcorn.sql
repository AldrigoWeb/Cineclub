alter table reviews drop constraint if exists reviews_rating_check;
alter table reviews alter column rating type real using rating::real;
alter table reviews add constraint reviews_rating_check check (rating between 0.5 and 5 and (rating*2)=floor(rating*2));
