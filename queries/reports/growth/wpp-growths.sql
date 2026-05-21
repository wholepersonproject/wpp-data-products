.mode csv
SELECT *
FROM (
  SELECT date, "group", COUNT(DISTINCT value) as count
  FROM (
    SELECT DISTINCT g.data_source, oDate as date, "group", value
    FROM read_csv(getenv('OUTPUT_DIR') || '/reports/growth/wpp-growth-*.csv') as g,
      ( -- Window function to select the most recent data source date that is less then the output date
        SELECT DISTINCT data_source, oDate, cDate
        FROM 
          (SELECT DISTINCT date as oDate FROM read_csv(getenv('OUTPUT_DIR') || '/reports/growth/wpp-growth-*.csv'))
          JOIN
          (SELECT DISTINCT data_source, date as cDate FROM read_csv(getenv('OUTPUT_DIR') || '/reports/growth/wpp-growth-*.csv'))
          ON (cDate <= oDate)
        QUALIFY ROW_NUMBER() OVER (
          PARTITION BY data_source, oDate
          ORDER BY cDate DESC
        ) = 1
      ) AS d
    WHERE g.data_source = d.data_source AND cDate = g.date
  )
  GROUP BY date, "group"
  ORDER BY date, "group"
)
UNION ALL (
  SELECT * FROM read_csv('/dev/stdin')
)
