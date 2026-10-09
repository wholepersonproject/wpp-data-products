.mode csv
SELECT
  'Anatomical Structures' as counts,
  (SELECT COUNT(*) FROM read_csv(getenv('OUTPUT_DIR') || '/reports/validation/wpp-uberon-missing-in-asctb.csv')) as wpp,
  (SELECT COUNT(*) FROM read_csv(getenv('OUTPUT_DIR') || '/reports/validation/wpp-uberon-only-in-asctb.csv')) as hra,
  (SELECT COUNT(*) FROM read_csv(getenv('OUTPUT_DIR') || '/reports/validation/wpp-uberon-present-in-asctb.csv')) as "wpp-hra"
UNION ALL
SELECT
  'Cell types' as counts,
  (SELECT COUNT(*) FROM read_csv(getenv('OUTPUT_DIR') || '/reports/validation/wpp-cl-missing-in-asctb.csv')) as wpp,
  (SELECT COUNT(*) FROM read_csv(getenv('OUTPUT_DIR') || '/reports/validation/wpp-cl-only-in-asctb.csv')) as hra,
  (SELECT COUNT(*) FROM read_csv(getenv('OUTPUT_DIR') || '/reports/validation/wpp-cl-present-in-asctb.csv')) as "wpp-hra"
UNION ALL
-- TODO: no biomarkers exist in WPP yet
SELECT 'Biomarkers' as counts, 0 as wpp, 1347 as hra, 0 as "wpp-hra"
UNION ALL (
  SELECT * FROM read_csv('/dev/stdin') LIMIT 0
)
