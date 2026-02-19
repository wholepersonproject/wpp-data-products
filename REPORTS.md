# Summary of Reports

  ## Table of Contents

* ad-hoc
  * [named graphs and number of tuples (named-graphs)](#named-graphs)



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
| https://purl.wholepersonphysiome.org/collection/wpp | 371527 |

## ad-hoc

  