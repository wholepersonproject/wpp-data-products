# Summary of Reports

  ## Table of Contents

* ad-hoc
  * [named graphs and number of tuples (named-graphs)](#named-graphs)
* validation
  * [CL IDs in WPP that are not in ASCT+B (wpp-cl-missing-in-asctb)](#wpp-cl-missing-in-asctb)
  * [CL IDs in WPP that are in ASCT+B (wpp-cl-present-in-asctb)](#wpp-cl-present-in-asctb)
  * [WPP effectors that occur in multiple tables (wpp-effectors-in-multiple-tables)](#wpp-effectors-in-multiple-tables)
  * [WPP time scales in tables (wpp-fields-in-multiple-tables)](#wpp-fields-in-multiple-tables)
  * [FTUs in WPP that are in ASCT+B or 2D FTUs (wpp-ftus-present-in-hra)](#wpp-ftus-present-in-hra)
  * [WPP time scales in tables (wpp-temporal-spatial-counts)](#wpp-temporal-spatial-counts)
  * [WPP time scales in tables (wpp-time-scales-in-multiple-tables)](#wpp-time-scales-in-multiple-tables)
  * [Uberon IDs in WPP that are not in ASCT+B (wpp-uberon-missing-in-asctb)](#wpp-uberon-missing-in-asctb)
  * [Uberon IDs in WPP that are in ASCT+B (wpp-uberon-present-in-asctb)](#wpp-uberon-present-in-asctb)
* wpp-ad-hoc
  * [WPP collection components and download URLs for them (wpp-component-graphs)](#wpp-component-graphs)



### <a id="named-graphs"></a>named graphs and number of tuples (named-graphs)



<details>
  <summary>View Sparql Query</summary>

```sparql
#+ summary: named graphs and number of tuples

PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

SELECT ?graph (COUNT(*) as ?triples) WHERE {
  GRAPH ?graph {
    ?s ?p ?o .
  }
}
GROUP BY ?graph
ORDER BY ?graph

```

([View Source](../wpp-data-products/queries/reports/ad-hoc/named-graphs.rq))
</details>

#### Results ([View CSV File](reports/ad-hoc/named-graphs.csv))

| graph | triples |
| :--- | :--- |
| https://purl.humanatlas.io/collection/hra | 2220241 |
| https://purl.humanatlas.io/vocab/cl | 119869 |
| https://purl.humanatlas.io/vocab/uberon | 1180265 |
| https://purl.wholepersonphysiome.org | 1669 |
| https://purl.wholepersonphysiome.org/collection/wpp | 375497 |
| ... | ... |

## ad-hoc

### <a id="wpp-cl-missing-in-asctb"></a>CL IDs in WPP that are not in ASCT+B (wpp-cl-missing-in-asctb)



<details>
  <summary>View Sparql Query</summary>

```sparql
#+ summary: CL IDs in WPP that are not in ASCT+B

PREFIX ccf: <http://purl.org/ccf/>
PREFIX dcat: <http://www.w3.org/ns/dcat#>
PREFIX prov: <http://www.w3.org/ns/prov#>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
PREFIX wpp: <https://purl.wholepersonphysiome.org/schema/wpp#>
PREFIX CL: <http://purl.obolibrary.org/obo/CL_>

PREFIX HRA: <https://purl.humanatlas.io/collection/hra>
PREFIX WPP: <https://purl.wholepersonphysiome.org/collection/wpp>

SELECT ?id ?label (GROUP_CONCAT(DISTINCT ?table;SEPARATOR='|') as ?wpp_tables)
WHERE {
  GRAPH WPP: {
    [
      a wpp:Record ;
      wpp:record_source ?source ;
      ?field [
        wpp:source_concept ?iri ;
      ] ;
    ] .
    ?iri rdfs:label ?label .

    BIND(REPLACE(STR(?source), 'https://purl.wholepersonphysiome.org/wpp/', '') as ?table)
    FILTER(STRSTARTS(STR(?iri), STR(CL:)))
    BIND(REPLACE(STR(?iri), STR(CL:), 'CL:') as ?id)

    FILTER NOT EXISTS {
      GRAPH HRA: {
        ?iri ccf:ccf_asctb_type "CT"^^xsd:string .
      }
    }
  }
}
GROUP BY ?id ?label
ORDER BY ?id

```

([View Source](../wpp-data-products/queries/reports/validation/wpp-cl-missing-in-asctb.rq))
</details>

#### Results ([View CSV File](reports/validation/wpp-cl-missing-in-asctb.csv))

| id | label | wpp_tables |
| :--- | :--- | :--- |
| CL:0000019 | sperm | male-reproductive-system |
| CL:0000023 | oocyte | female-reproductive-system |
| CL:0000043 | mature basophil | immune-and-lymphatic-system |
| CL:0000060 | odontoblast | dental-and-craniofacial-system |
| CL:0000062 | osteoblast | dental-and-craniofacial-system|male-reproductive-system|skeletal-system|endocrine-system|integumentary-system |
| ... | ... | ... |

## validation

### <a id="wpp-cl-present-in-asctb"></a>CL IDs in WPP that are in ASCT+B (wpp-cl-present-in-asctb)



<details>
  <summary>View Sparql Query</summary>

```sparql
#+ summary: CL IDs in WPP that are in ASCT+B

PREFIX ccf: <http://purl.org/ccf/>
PREFIX dcat: <http://www.w3.org/ns/dcat#>
PREFIX prov: <http://www.w3.org/ns/prov#>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
PREFIX wpp: <https://purl.wholepersonphysiome.org/schema/wpp#>
PREFIX CL: <http://purl.obolibrary.org/obo/CL_>

PREFIX HRA: <https://purl.humanatlas.io/collection/hra>
PREFIX WPP: <https://purl.wholepersonphysiome.org/collection/wpp>

SELECT ?id ?label (GROUP_CONCAT(DISTINCT ?table;SEPARATOR='|') as ?wpp_tables)
WHERE {
  GRAPH HRA: {
    ?iri ccf:ccf_asctb_type "CT"^^xsd:string .
    ?iri rdfs:label ?label .
  }
  GRAPH WPP: {
    [
      a wpp:Record ;
      wpp:record_source ?source ;
      ?field [
        wpp:source_concept ?iri ;
      ] ;
    ] .
    BIND(REPLACE(STR(?source), 'https://purl.wholepersonphysiome.org/wpp/', '') as ?table)
    FILTER(STRSTARTS(STR(?iri), STR(CL:)))
    BIND(REPLACE(STR(?iri), STR(CL:), 'CL:') as ?id)
  }
}
GROUP BY ?id ?label
ORDER BY ?id

```

([View Source](../wpp-data-products/queries/reports/validation/wpp-cl-present-in-asctb.rq))
</details>

#### Results ([View CSV File](reports/validation/wpp-cl-present-in-asctb.csv))

| id | label | wpp_tables |
| :--- | :--- | :--- |
| CL:0000034 | stem cell | digestive-system|integumentary-system |
| CL:0000037 | hematopoietic stem cell | immune-and-lymphatic-system |
| CL:0000057 | fibroblast | fascia-system |
| CL:0000066 | epithelial cell | digestive-system|immune-and-lymphatic-system |
| CL:0000084 | T cell | immune-and-lymphatic-system|integumentary-system |
| ... | ... | ... |


### <a id="wpp-effectors-in-multiple-tables"></a>WPP effectors that occur in multiple tables (wpp-effectors-in-multiple-tables)



<details>
  <summary>View Sparql Query</summary>

```sparql
#+ summary: WPP effectors that occur in multiple tables

PREFIX ccf: <http://purl.org/ccf/>
PREFIX dcat: <http://www.w3.org/ns/dcat#>
PREFIX prov: <http://www.w3.org/ns/prov#>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
PREFIX wpp: <https://purl.wholepersonphysiome.org/schema/wpp#>
PREFIX CL: <http://purl.obolibrary.org/obo/CL_>
PREFIX UBERON: <http://purl.obolibrary.org/obo/UBERON_>

PREFIX HRA: <https://purl.humanatlas.io/collection/hra>
PREFIX WPP: <https://purl.wholepersonphysiome.org/collection/wpp>

SELECT ?id ?label (GROUP_CONCAT(DISTINCT ?table;SEPARATOR='|') as ?wpp_tables) (COUNT(DISTINCT ?table) as ?table_count)
FROM WPP:
WHERE {
  [
    a wpp:Record ;
    wpp:record_source ?source ;
    wpp:effector_field [
      wpp:source_concept ?iri ;
    ] ;
  ] .
  ?iri rdfs:label ?label .

  BIND(REPLACE(STR(?source), 'https://purl.wholepersonphysiome.org/wpp/', '') as ?table)
  BIND(REPLACE(REPLACE(STR(?iri), STR(CL:), 'CL:'), STR(UBERON:), 'UBERON:') as ?id)
}
GROUP BY ?id ?label
HAVING (?table_count > 1)
ORDER BY DESC(?table_count) ?id

```

([View Source](../wpp-data-products/queries/reports/validation/wpp-effectors-in-multiple-tables.rq))
</details>

#### Results ([View CSV File](reports/validation/wpp-effectors-in-multiple-tables.csv))

| id | label | wpp_tables | table_count |
| :--- | :--- | :--- | :--- |
| CL:0000192 | smooth muscle cell | cardiovascular-system|muscular-system|digestive-system|integumentary-system|pulmonary-system|nervous-system|endocrine-system | 7 |
| CL:0000062 | osteoblast | dental-and-craniofacial-system|skeletal-system|endocrine-system|male-reproductive-system|integumentary-system | 5 |
| CL:0008002 | skeletal muscle fiber | nervous-system|muscular-system|endocrine-system|male-reproductive-system|female-reproductive-system | 5 |
| CL:1000838 | kidney proximal convoluted tubule epithelial cell | dental-and-craniofacial-system|cardiovascular-system|endocrine-system|urinary-system|skeletal-system | 5 |
| CL:0000092 | osteoclast | dental-and-craniofacial-system|endocrine-system|skeletal-system|male-reproductive-system | 4 |
| ... | ... | ... | ... |


### <a id="wpp-fields-in-multiple-tables"></a>WPP time scales in tables (wpp-fields-in-multiple-tables)



<details>
  <summary>View Sparql Query</summary>

```sparql
#+ summary: WPP time scales in tables

PREFIX ccf: <http://purl.org/ccf/>
PREFIX dcat: <http://www.w3.org/ns/dcat#>
PREFIX prov: <http://www.w3.org/ns/prov#>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
PREFIX wpp: <https://purl.wholepersonphysiome.org/schema/wpp#>
PREFIX CL: <http://purl.obolibrary.org/obo/CL_>
PREFIX UBERON: <http://purl.obolibrary.org/obo/UBERON_>

PREFIX HRA: <https://purl.humanatlas.io/collection/hra>
PREFIX WPP: <https://purl.wholepersonphysiome.org/collection/wpp>

SELECT ?field ?value (GROUP_CONCAT(DISTINCT ?table;SEPARATOR='|') as ?wpp_tables) (COUNT(DISTINCT ?table) as ?table_count)
FROM WPP:
WHERE {
  
  [
    a wpp:Record ;
    wpp:record_source ?source ;
    ?field_pred ?value ;
  ] .

  FILTER(isLITERAL(?value) && ?field_pred != wpp:record_number)
  BIND(REPLACE(STR(?source), 'https://purl.wholepersonphysiome.org/wpp/', '') as ?table)
  BIND(REPLACE(REPLACE(STR(?field_pred), STR(wpp:), ''), '_field', '') as ?field)
}
GROUP BY ?field ?value
ORDER BY ?field DESC(?table_count)

```

([View Source](../wpp-data-products/queries/reports/validation/wpp-fields-in-multiple-tables.rq))
</details>

#### Results ([View CSV File](reports/validation/wpp-fields-in-multiple-tables.csv))

| field | value | wpp_tables | table_count |
| :--- | :--- | :--- | :--- |
| behavior | X secretion | dental-and-craniofacial-system|cardiovascular-system|nervous-system|immune-and-lymphatic-system|skeletal-system|endocrine-system|pulmonary-system|digestive-system|urinary-system|integumentary-system|male-reproductive-system|fascia-system|female-reproductive-system | 13 |
| behavior | X conversion to Y | dental-and-craniofacial-system|nervous-system|pulmonary-system|skeletal-system|endocrine-system|urinary-system|fascia-system|integumentary-system|male-reproductive-system|muscular-system|female-reproductive-system|immune-and-lymphatic-system | 12 |
| behavior | X synthesis | dental-and-craniofacial-system|immune-and-lymphatic-system|skeletal-system|nervous-system|digestive-system|endocrine-system|fascia-system|integumentary-system|female-reproductive-system|male-reproductive-system | 10 |
| behavior | X export | cardiovascular-system|endocrine-system|digestive-system|nervous-system|dental-and-craniofacial-system|male-reproductive-system|skeletal-system|female-reproductive-system|muscular-system | 9 |
| behavior | X uptake | cardiovascular-system|dental-and-craniofacial-system|immune-and-lymphatic-system|skeletal-system|digestive-system|nervous-system|endocrine-system|fascia-system|muscular-system | 9 |
| ... | ... | ... | ... |


### <a id="wpp-ftus-present-in-hra"></a>FTUs in WPP that are in ASCT+B or 2D FTUs (wpp-ftus-present-in-hra)



<details>
  <summary>View Sparql Query</summary>

```sparql
#+ summary: FTUs in WPP that are in ASCT+B or 2D FTUs

PREFIX ccf: <http://purl.org/ccf/>
PREFIX dcat: <http://www.w3.org/ns/dcat#>
PREFIX prov: <http://www.w3.org/ns/prov#>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
PREFIX wpp: <https://purl.wholepersonphysiome.org/schema/wpp#>
PREFIX UBERON: <http://purl.obolibrary.org/obo/UBERON_>

PREFIX HRA: <https://purl.humanatlas.io/collection/hra>
PREFIX WPP: <https://purl.wholepersonphysiome.org/collection/wpp>

SELECT ?id ?label (GROUP_CONCAT(DISTINCT ?field;SEPARATOR='|') as ?fields) (GROUP_CONCAT(DISTINCT ?table;SEPARATOR='|') as ?wpp_tables)
WHERE {
  GRAPH HRA: {
    {
      [
        a ccf:FtuIllustration ;
        ccf:representation_of ?iri ;
      ] .
    }
    UNION
    {
      [
        a ccf:AsctbRecord ;
        ccf:ftu_types [
          ccf:source_concept ?iri 
        ];
      ] .
    }
    ?iri rdfs:label ?label .
  }
  GRAPH WPP: {
    [
      a wpp:Record ;
      wpp:record_source ?source ;
      ?field_pred [
        wpp:source_concept ?iri ;
      ] ;
    ] .
    BIND(REPLACE(STR(?source), 'https://purl.wholepersonphysiome.org/wpp/', '') as ?table)
    FILTER(STRSTARTS(STR(?iri), STR(UBERON:)))
    BIND(REPLACE(STR(?iri), STR(UBERON:), 'UBERON:') as ?id)
    BIND(REPLACE(REPLACE(STR(?field_pred), STR(wpp:), ''), '_field', '') as ?field)
  }
}
GROUP BY ?id ?label
ORDER BY ?id

```

([View Source](../wpp-data-products/queries/reports/validation/wpp-ftus-present-in-hra.rq))
</details>

#### Results ([View CSV File](reports/validation/wpp-ftus-present-in-hra.csv))

| id | label | fields | wpp_tables |
| :--- | :--- | :--- | :--- |
| UBERON:0000006 | islet of Langerhans | effector_location | endocrine-system |
| UBERON:0000412 | dermal papilla | effector|effector_location | integumentary-system |
| UBERON:0000941 | cranial nerve II | effector | dental-and-craniofacial-system|nervous-system |
| UBERON:0000966 | retina | effector_location | dental-and-craniofacial-system|nervous-system |
| UBERON:0001263 | pancreatic acinus | effector_location | endocrine-system |
| ... | ... | ... | ... |


### <a id="wpp-temporal-spatial-counts"></a>WPP time scales in tables (wpp-temporal-spatial-counts)



<details>
  <summary>View Sparql Query</summary>

```sparql
#+ summary: WPP time scales in tables

PREFIX ccf: <http://purl.org/ccf/>
PREFIX dcat: <http://www.w3.org/ns/dcat#>
PREFIX prov: <http://www.w3.org/ns/prov#>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
PREFIX wpp: <https://purl.wholepersonphysiome.org/schema/wpp#>
PREFIX CL: <http://purl.obolibrary.org/obo/CL_>
PREFIX UBERON: <http://purl.obolibrary.org/obo/UBERON_>

PREFIX HRA: <https://purl.humanatlas.io/collection/hra>
PREFIX WPP: <https://purl.wholepersonphysiome.org/collection/wpp>

SELECT ?table ?time_scale ?effector_scale (COUNT(DISTINCT ?process) as ?process_count) (GROUP_CONCAT(DISTINCT ?process;SEPARATOR='|') as ?processes)
FROM WPP:
WHERE {
  [
    a wpp:Record ;
    wpp:record_source ?source ;
    wpp:time_scale_field ?raw_time_scale ;
    wpp:effector_scale_field ?raw_effector_scale ;
    wpp:process_field ?process ;
  ] .

  # TODO: Update these values at the source
  BIND(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(LCASE(?raw_time_scale), '\\(.*\\)\\s*', ''), '^\\s+|\\s+$', ''), ', ', '-'), ' – ', '-'), ' to ', '-') as ?time_scale)
  # TODO: Update these values at the source
  BIND(LCASE(?raw_effector_scale) as ?effector_scale)
  BIND(REPLACE(STR(?source), 'https://purl.wholepersonphysiome.org/wpp/', '') as ?table)
}
GROUP BY ?table ?time_scale ?effector_scale
ORDER BY ?table ?time_scale ?effector_scale

```

([View Source](../wpp-data-products/queries/reports/validation/wpp-temporal-spatial-counts.rq))
</details>

#### Results ([View CSV File](reports/validation/wpp-temporal-spatial-counts.csv))

| table | time_scale | effector_scale | process_count | processes |
| :--- | :--- | :--- | :--- | :--- |
| cardiovascular-system | milliseconds | cell | 1 | baroreceptor reflex |
| cardiovascular-system | milliseconds | tissue | 2 | cardiac conduction|baroreceptor reflex |
| cardiovascular-system | minutes | cell | 5 | ANP triggers vasodilation of afferent arterioles to increase renal blood flow|BNP triggers vasodilation and natriuresis in response to increased preload|renin is released in response to decreased afferent arteriole pressure|angiotensin I is cleaved to angiotensin II by angiotensin converting enzyme in the lung endothelial cells|angiotensin I is cleaved to angiotensin II by angiotensin converting enzyme in the tubular endothelial cells |
| cardiovascular-system | seconds | tissue | 4 | resistance to flow|reflex bradycardia|reflex tachycardia|baroreceptor reflex |
| dental-and-craniofacial-system | hours | cell | 1 | collagen is produced by osteoblasts and indicates increased bone synthesis |
| ... | ... | ... | ... | ... |


### <a id="wpp-time-scales-in-multiple-tables"></a>WPP time scales in tables (wpp-time-scales-in-multiple-tables)



<details>
  <summary>View Sparql Query</summary>

```sparql
#+ summary: WPP time scales in tables

PREFIX ccf: <http://purl.org/ccf/>
PREFIX dcat: <http://www.w3.org/ns/dcat#>
PREFIX prov: <http://www.w3.org/ns/prov#>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
PREFIX wpp: <https://purl.wholepersonphysiome.org/schema/wpp#>
PREFIX CL: <http://purl.obolibrary.org/obo/CL_>
PREFIX UBERON: <http://purl.obolibrary.org/obo/UBERON_>

PREFIX HRA: <https://purl.humanatlas.io/collection/hra>
PREFIX WPP: <https://purl.wholepersonphysiome.org/collection/wpp>

SELECT ?scale (GROUP_CONCAT(DISTINCT ?table;SEPARATOR='|') as ?wpp_tables) (COUNT(DISTINCT ?table) as ?table_count)
FROM WPP:
WHERE {
  [
    a wpp:Record ;
    wpp:record_source ?source ;
    wpp:time_scale_field ?scale ;
  ] .

  BIND(REPLACE(STR(?source), 'https://purl.wholepersonphysiome.org/wpp/', '') as ?table)
}
GROUP BY ?scale
ORDER BY DESC(?table_count) ?scale

```

([View Source](../wpp-data-products/queries/reports/validation/wpp-time-scales-in-multiple-tables.rq))
</details>

#### Results ([View CSV File](reports/validation/wpp-time-scales-in-multiple-tables.csv))

| scale | wpp_tables | table_count |
| :--- | :--- | :--- |
| milliseconds | cardiovascular-system|dental-and-craniofacial-system|immune-and-lymphatic-system|nervous-system|male-reproductive-system|muscular-system|digestive-system|fascia-system|urinary-system|female-reproductive-system|integumentary-system | 11 |
| minutes | dental-and-craniofacial-system|cardiovascular-system|immune-and-lymphatic-system|nervous-system|male-reproductive-system|endocrine-system|skeletal-system|urinary-system|fascia-system|female-reproductive-system|integumentary-system | 11 |
| seconds | cardiovascular-system|dental-and-craniofacial-system|nervous-system|muscular-system|male-reproductive-system|endocrine-system|urinary-system|fascia-system|immune-and-lymphatic-system|female-reproductive-system|integumentary-system | 11 |
| hours | dental-and-craniofacial-system|immune-and-lymphatic-system|male-reproductive-system|endocrine-system|skeletal-system|urinary-system|fascia-system|female-reproductive-system|integumentary-system | 9 |
| days | immune-and-lymphatic-system|male-reproductive-system|fascia-system|urinary-system|female-reproductive-system|integumentary-system | 6 |
| ... | ... | ... |


### <a id="wpp-uberon-missing-in-asctb"></a>Uberon IDs in WPP that are not in ASCT+B (wpp-uberon-missing-in-asctb)



<details>
  <summary>View Sparql Query</summary>

```sparql
#+ summary: Uberon IDs in WPP that are not in ASCT+B

PREFIX ccf: <http://purl.org/ccf/>
PREFIX dcat: <http://www.w3.org/ns/dcat#>
PREFIX prov: <http://www.w3.org/ns/prov#>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
PREFIX wpp: <https://purl.wholepersonphysiome.org/schema/wpp#>
PREFIX UBERON: <http://purl.obolibrary.org/obo/UBERON_>

PREFIX HRA: <https://purl.humanatlas.io/collection/hra>
PREFIX WPP: <https://purl.wholepersonphysiome.org/collection/wpp>

SELECT ?id ?label (GROUP_CONCAT(DISTINCT ?table;SEPARATOR='|') as ?wpp_tables)
WHERE {
  GRAPH WPP: {
    [
      a wpp:Record ;
      wpp:record_source ?source ;
      ?field [
        wpp:source_concept ?iri ;
      ] ;
    ] .
    ?iri rdfs:label ?label .

    BIND(REPLACE(STR(?source), 'https://purl.wholepersonphysiome.org/wpp/', '') as ?table)
    FILTER(STRSTARTS(STR(?iri), STR(UBERON:)))
    BIND(REPLACE(STR(?iri), STR(UBERON:), 'UBERON:') as ?id)

    FILTER NOT EXISTS {
      GRAPH HRA: {
        ?iri ccf:ccf_asctb_type "AS"^^xsd:string .
      }
    }
  }
}
GROUP BY ?id ?label
ORDER BY ?id

```

([View Source](../wpp-data-products/queries/reports/validation/wpp-uberon-missing-in-asctb.rq))
</details>

#### Results ([View CSV File](reports/validation/wpp-uberon-missing-in-asctb.csv))

| id | label | wpp_tables |
| :--- | :--- | :--- |
| UBERON:0000007 | pituitary gland | endocrine-system|female-reproductive-system|male-reproductive-system |
| UBERON:0000011 | parasympathetic nervous system | nervous-system|urinary-system |
| UBERON:0000013 | sympathetic nervous system | nervous-system|urinary-system |
| UBERON:0000033 | head | nervous-system |
| UBERON:0000043 | tendon | fascia-system |
| ... | ... | ... |


### <a id="wpp-uberon-present-in-asctb"></a>Uberon IDs in WPP that are in ASCT+B (wpp-uberon-present-in-asctb)



<details>
  <summary>View Sparql Query</summary>

```sparql
#+ summary: Uberon IDs in WPP that are in ASCT+B

PREFIX ccf: <http://purl.org/ccf/>
PREFIX dcat: <http://www.w3.org/ns/dcat#>
PREFIX prov: <http://www.w3.org/ns/prov#>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
PREFIX wpp: <https://purl.wholepersonphysiome.org/schema/wpp#>
PREFIX UBERON: <http://purl.obolibrary.org/obo/UBERON_>

PREFIX HRA: <https://purl.humanatlas.io/collection/hra>
PREFIX WPP: <https://purl.wholepersonphysiome.org/collection/wpp>

SELECT ?id ?label (GROUP_CONCAT(DISTINCT ?table;SEPARATOR='|') as ?wpp_tables)
WHERE {
  GRAPH HRA: {
    ?iri ccf:ccf_asctb_type "AS"^^xsd:string .
    ?iri rdfs:label ?label .
  }
  GRAPH WPP: {
    [
      a wpp:Record ;
      wpp:record_source ?source ;
      ?field [
        wpp:source_concept ?iri ;
      ] ;
    ] .
    BIND(REPLACE(STR(?source), 'https://purl.wholepersonphysiome.org/wpp/', '') as ?table)
    FILTER(STRSTARTS(STR(?iri), STR(UBERON:)))
    BIND(REPLACE(STR(?iri), STR(UBERON:), 'UBERON:') as ?id)
  }
}
GROUP BY ?id ?label
ORDER BY ?id

```

([View Source](../wpp-data-products/queries/reports/validation/wpp-uberon-present-in-asctb.rq))
</details>

#### Results ([View CSV File](reports/validation/wpp-uberon-present-in-asctb.csv))

| id | label | wpp_tables |
| :--- | :--- | :--- |
| UBERON:0000002 | uterine cervix | female-reproductive-system |
| UBERON:0000006 | islet of Langerhans | endocrine-system |
| UBERON:0000010 | peripheral nervous system | nervous-system |
| UBERON:0000029 | lymph node | immune-and-lymphatic-system|integumentary-system |
| UBERON:0000044 | dorsal root ganglion | nervous-system |
| ... | ... | ... |


### <a id="wpp-component-graphs"></a>WPP collection components and download URLs for them (wpp-component-graphs)



<details>
  <summary>View Sparql Query</summary>

```sparql
#+ summary: WPP collection components and download URLs for them

PREFIX dcat: <http://www.w3.org/ns/dcat#>
PREFIX prov: <http://www.w3.org/ns/prov#>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>

PREFIX WPP_KG: <https://purl.wholepersonphysiome.org>
PREFIX WPP: <https://purl.wholepersonphysiome.org/collection/wpp>

SELECT ?named_graph ?download_url
FROM WPP:
FROM WPP_KG:
WHERE {
  WPP: prov:hadMember ?component .
  [] a dcat:Dataset ;
    rdfs:seeAlso ?component ;
    dcat:distribution [
      dcat:downloadURL ?download_url ;
      dcat:mediaType "text/turtle"^^xsd:string
    ] ;
  .
  BIND(REPLACE(STR(?component), '/draft', '') as ?named_graph)
}

```

([View Source](../wpp-data-products/queries/reports/wpp-ad-hoc/wpp-component-graphs.rq))
</details>

#### Results ([View CSV File](reports/wpp-ad-hoc/wpp-component-graphs.csv))

| named_graph | download_url |
| :--- | :--- |
| https://purl.wholepersonphysiome.org/wpp/cardiovascular-system | https://wholepersonproject.github.io/wpp-kg/wpp/cardiovascular-system/draft/graph.ttl |
| https://purl.wholepersonphysiome.org/wpp/dental-and-craniofacial-system | https://wholepersonproject.github.io/wpp-kg/wpp/dental-and-craniofacial-system/draft/graph.ttl |
| https://purl.wholepersonphysiome.org/wpp/digestive-system | https://wholepersonproject.github.io/wpp-kg/wpp/digestive-system/draft/graph.ttl |
| https://purl.wholepersonphysiome.org/wpp/endocrine-system | https://wholepersonproject.github.io/wpp-kg/wpp/endocrine-system/draft/graph.ttl |
| https://purl.wholepersonphysiome.org/wpp/fascia-system | https://wholepersonproject.github.io/wpp-kg/wpp/fascia-system/draft/graph.ttl |
| ... | ... |

## wpp-ad-hoc

  