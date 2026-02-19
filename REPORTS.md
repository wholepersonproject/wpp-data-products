# Summary of Reports

  ## Table of Contents

* ad-hoc
  * [named graphs and number of tuples (named-graphs)](#named-graphs)
* validation
  * [get WPP collection components and download URLs for them (wpp-cl-missing-in-asctb)](#wpp-cl-missing-in-asctb)
  * [get WPP collection components and download URLs for them (wpp-cl-present-in-asctb)](#wpp-cl-present-in-asctb)
  * [get WPP collection components and download URLs for them (wpp-uberon-missing-in-asctb)](#wpp-uberon-missing-in-asctb)
  * [get WPP collection components and download URLs for them (wpp-uberon-present-in-asctb)](#wpp-uberon-present-in-asctb)
* wpp-ad-hoc
  * [get WPP collection components and download URLs for them (wpp-component-graphs)](#wpp-component-graphs)



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

### <a id="wpp-cl-missing-in-asctb"></a>get WPP collection components and download URLs for them (wpp-cl-missing-in-asctb)



<details>
  <summary>View Sparql Query</summary>

```sparql
#+ summary: get WPP collection components and download URLs for them

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
    [] a wpp:Record ;
      ?field [
        wpp:source_concept ?iri ;
      ] ;
      wpp:record_source ?source .
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
| CL:0000062 | osteoblast | dental-and-craniofacial-system|endocrine-system|male-reproductive-system|skeletal-system|integumentary-system |
| ... | ... | ... |

## validation

### <a id="wpp-cl-present-in-asctb"></a>get WPP collection components and download URLs for them (wpp-cl-present-in-asctb)



<details>
  <summary>View Sparql Query</summary>

```sparql
#+ summary: get WPP collection components and download URLs for them

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
    [] a wpp:Record ;
      ?field [
        wpp:source_concept ?iri ;
      ] ;
      wpp:record_source ?source .
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

| id | label | tables |
| :--- | :--- | :--- |
| CL:0000034 | stem cell | digestive-system|integumentary-system |
| CL:0000037 | hematopoietic stem cell | immune-and-lymphatic-system |
| CL:0000057 | fibroblast | fascia-system |
| CL:0000066 | epithelial cell | digestive-system|immune-and-lymphatic-system |
| CL:0000084 | T cell | immune-and-lymphatic-system|integumentary-system |
| ... | ... | ... |


### <a id="wpp-uberon-missing-in-asctb"></a>get WPP collection components and download URLs for them (wpp-uberon-missing-in-asctb)



<details>
  <summary>View Sparql Query</summary>

```sparql
#+ summary: get WPP collection components and download URLs for them

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
    [] a wpp:Record ;
      ?field [
        wpp:source_concept ?iri ;
      ] ;
      wpp:record_source ?source .
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


### <a id="wpp-uberon-present-in-asctb"></a>get WPP collection components and download URLs for them (wpp-uberon-present-in-asctb)



<details>
  <summary>View Sparql Query</summary>

```sparql
#+ summary: get WPP collection components and download URLs for them

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
    [] a wpp:Record ;
      ?field [
        wpp:source_concept ?iri ;
      ] ;
      wpp:record_source ?source .
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


### <a id="wpp-component-graphs"></a>get WPP collection components and download URLs for them (wpp-component-graphs)



<details>
  <summary>View Sparql Query</summary>

```sparql
#+ summary: get WPP collection components and download URLs for them

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

  