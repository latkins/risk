CREATE TABLE IF NOT EXISTS stockname
       ( quandlcode TEXT PRIMARY KEY
       , name TEXT);

CREATE TABLE IF NOT EXISTS quandldata
       ( quandlcode TEXT REFERENCES stockname (quandlcode)
       , date TIMESTAMP
       , open DOUBLE PRECISION
       , high DOUBLE PRECISION
       , low DOUBLE PRECISION
       , close DOUBLE PRECISION
       , volume DOUBLE PRECISION
       , ex_dividend DOUBLE PRECISION
       , split_ratio DOUBLE PRECISION
       , adj_open DOUBLE PRECISION
       , adj_high DOUBLE PRECISION
       , adj_low DOUBLE PRECISION
       , adj_close DOUBLE PRECISION
       , adj_volume DOUBLE PRECISION
       , PRIMARY KEY (quandlcode, date)
       );
