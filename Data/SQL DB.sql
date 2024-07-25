DROP TABLE deaths;
DROP TABLE costs;

CREATE TABLE deaths (
	jurisdiction VARCHAR (30) NOT NULL,
	mmwr_year VARCHAR (30) NOT NULL,
	mmwr_week VARCHAR (30) NOT NULL,
	week_end DATE NOT NULL,
	all_causes INT NOT NULL,
	nat_causes INT NOT NULL,
	chron_causes INT NOT NULL,
	non_chron_causes INT NOT NULL
);

CREATE TABLE costs (
    id SERIAL PRIMARY KEY,
    age INT NOT NULL,
    sex VARCHAR(10) NOT NULL,
    bmi FLOAT NOT NULL,
    children INT NOT NULL,
    smoker BOOLEAN NOT NULL,
    region VARCHAR(30) NOT NULL,
    charges FLOAT NOT NULL
);

--SELECT * from costs;
SELECT SUM(nat_causes) AS total_nat_causes
	from deaths;


