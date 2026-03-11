.mode csv
SELECT *
FROM (
  SELECT '# AS only in WPP' as label, COUNT(*) as count
  FROM read_csv(getenv('OUTPUT_DIR') || '/reports/validation/wpp-uberon-missing-in-asctb.csv')
)
UNION ALL (
  SELECT '# AS only in HRA' as label, COUNT(*) as count 
  FROM read_csv(getenv('OUTPUT_DIR') || '/reports/validation/wpp-uberon-only-in-asctb.csv')
)
UNION ALL (
  SELECT '# AS in WPP & HRA' as label, COUNT(*) as count 
  FROM read_csv(getenv('OUTPUT_DIR') || '/reports/validation/wpp-uberon-present-in-asctb.csv')
)
UNION ALL (
  SELECT '# CT only in WPP' as label, COUNT(*) as count
  FROM read_csv(getenv('OUTPUT_DIR') || '/reports/validation/wpp-cl-missing-in-asctb.csv')
)
UNION ALL (
  SELECT '# CT only in HRA' as label, COUNT(*) as count
  FROM read_csv(getenv('OUTPUT_DIR') || '/reports/validation/wpp-cl-only-in-asctb.csv')
)
UNION ALL (
  SELECT '# CT in WPP & HRA' as label, COUNT(*) as count
  FROM read_csv(getenv('OUTPUT_DIR') || '/reports/validation/wpp-cl-present-in-asctb.csv')
)
UNION ALL (
  SELECT * FROM read_csv('/dev/stdin')
)
