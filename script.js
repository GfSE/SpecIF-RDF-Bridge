console.log("test")


let exampleText = `{
    "$schema": "https://specif.de/v1.0/schema.json",
    "id": "P-Requirement-with-Properties",
    "title": "Requirements Template",
    "dataTypes": [{
      "id": "DT-ShortString",
      "title": "String[96]",
      "description": "String with max. length 96.",
      "type": "xs:string",
      "maxLength": 96,
      "changedAt": "2016-05-26T08:59:00+02:00"
    },{
      "id": "DT-FormattedText",
      "title": "Formatted Text",
      "description": "XHTML formatted text with max. length 8156.",
      "type": "xhtml",
      "maxLength": 8156,
      "changedAt": "2016-05-26T08:59:00+02:00"
    }],
    "propertyClasses": [{
      "id": "PC-Name",
      "title": "dcterms:title",
      "description": "A name given to the resource.",
      "dataType": "DT-ShortString",
      "changedAt": "2016-05-26T08:59:00+02:00"
    },{
      "id": "PC-Description",
      "title": "dcterms:description",
      "description": "An account of the resource. Descriptive text about the resource represented as rich text in XHTML.",
      "dataType": "DT-FormattedText",
      "changedAt": "2016-05-26T08:59:00+02:00"
    }],
    "resourceClasses": [{
      "id": "RC-Requirement",
      "title": "IREB:Requirement",
      "description": "A 'Requirement' is a singular documented physical and functional need that a particular design, product or process must be able to perform.",
      
      "propertyClasses": [ "PC-Name", "PC-Description" ],
      "changedAt": "2016-05-26T08:59:00+02:00"
    }],
    "statementClasses": [],
    "resources": [{
        "id": "Req-5ba3512b0000bca",
        "title": "Minimum button size",
        "class": "RC-Requirement",
        "properties": [{
            "title": "dcterms:title",
            "class": "PC-Name",
            "value": "Minimum button size"
        },{
            "class": "PC-Description",
            "value": "<p>The <i>button size</i> MUST not be less than 2 cm in diameter.</p>"
        }],
        "changedAt": "2017-06-19T20:13:08+02:00"
    }],
    "statements": [],
    "hierarchies": [{
        "id": "N-bca801377e3d1525",
        "resource": "Req-5ba3512b0000bca",
        "changedAt": "2019-05-29T13:19:28.546Z"
    }]
}`

transformSpecifToRDF = (specifFile) => {
    let ej= JSON.parse(specifFile)

    let ergebnis = `@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
    @prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .
    @prefix foaf: <http://xmlns.com/foaf/0.1/> .
    @prefix owl: <http://www.w3.org/2002/07/owl#> .
    @prefix xsd: <http://www.w3.org/2001/XMLSchema#> .
    @prefix dcterms: <http://purl.org/dc/terms/> .
    @prefix vann: <http://purl.org/vocab/vann/> .
    @prefix foaf: <http://xmlns.com/foaf/0.1/> .
    
    @prefix meta: <http://specif.de/v1.0/schema/meta#> .
    @prefix SpecIF: <http://specif.de/v1.0/schema/core#> .
    @prefix FMC: <http://specif.de/v1.0/schema/fmc#> .
    @prefix IREB: <http://specif.de/v1.0/schema/ireb#> .
    @prefix SysML: <http://specif.de/v1.0/schema/sysml#> .
    @prefix oslc: <http://specif.de/v1.0/schema/oslc#> .
    @prefix oslc_rm: <http://specif.de/v1.0/schema/oslc_rm#> .
    @prefix HIS: <http://specif.de/v1.0/schema/HIS#> .
    @prefix BPMN: <http://specif.de/v1.0/schema/bpmn#> .
    
    `
    let base = 'http://example.com/'
    let projectID = ej.id
    let ProjectURI = base+projectID
    
    //Mapping of the properyClasses
    // properties get extracted from PropertyClasses and are used
    // in Resources. 
    properties = [];
    
    // Setting ProjectSctructure id -> title
    ergebnis += `<${ProjectURI}> a meta:Document ;
            rdfs:label "${ej.title}" .`
    //      dcterms:modified ej.createdAt
    //      dcterms:schema ej.$schema
    

    // Transform Datatypes to RDF
    //ej.dataTypes.forEach( hierarchy => {  })
    ergebnis += transformDatatypes(ProjectURI, ej.dataTypes)

    //Transform PropertyClasses to RDF
    {/* ej.propertyClasses.forEach(propertyClass => {        
        //Mapping of propertyClass to title
        properties[propertyClass.id] = propertyClass.title;
    
        let propertyClassMappingUri = ProjectURI+"/"+propertyClass.id;
        ergebnis += `<${ProjectURI}> meta:containsPropertyClassMapping <${propertyClassMappingUri}> .
        
        <${propertyClassMappingUri}> a meta:PropertyClassMapping ;
        meta:id "${propertyClass.id}" ;
        meta:title "${propertyClass.title}" ; # Literal
        rdfs:comment "${propertyClass.description}" ; # Literal
        meta:vocabularyElement ${propertyClass.title} ; # rely on prefix definitions (quick and dirty), only in Turtle syntax
       #meta:vocabularyElement <http://purl.org/dc/terms/title> ; # resolved to URI
        meta:dataType "${propertyClass.dataType}" ;
        dcterms:modified "${propertyClass.changedAt}" .`
    }) */}
    ergebnis += transformPropertyClasses(ProjectURI, ej.propertyClasses)
    

    //Transform ResourceClasses to RDF
   {/* ej.resourceClasses.forEach(resourceClass => {
        let resourceClassMappingUri = ProjectURI+"/"+resourceClass.id;
        ergebnis += `<${ProjectURI}> meta:containsResourceClassMapping <${resourceClassMappingUri}> .
    
        <${resourceClassMappingUri}> a meta:ResourceClassMapping ;
        meta:id "${resourceClass.id}" ;
        meta:title "${resourceClass.title}";
        meta:vocabularyElement ${resourceClass.title} ;
        meta:description "${resourceClass.description}" ;
        meta:icon "${resourceClass.icon}" ;
        dcterms:modified "${resourceClass.changedAt}" ;
        `
        
        resourceClass.propertyClasses.forEach( proertyClass => {
            ergebnis += `meta:propertyClasses <http://example.com/P-Requirement-with-Properties/${proertyClass}> ;
            `
        })
    
        ergebnis += `.
        `
    }) */}
    ergebnis += transformResourceClasses(ProjectURI,ej.resourceClasses)
    

    // Transform Statementclasses to RDF
    //ej.statementClasses.forEach( hierarchy => {  })
    ergebnis += transformStatementClasses(ProjectURI, ej.statementClasses);

    // Transform Resource to RDF
{/* ej.resources.forEach( resource => {
        let resourceUri = ProjectURI+"/"+resource.id;
        
        ergebnis += `<${resourceUri}> a IREB:Requirement;
        rdfs:label "${resource.title}" ;
        dcterms:modifed "${resource.changedAt}" ;
        `
    
        resource.properties.forEach( property => {
            ergebnis +=  `${properties[property.class]} "${property.value}" ;
            `;
        })
        ergebnis += `.
        `
    }) */}
    ergebnis += transformResources(ProjectURI, ej.resources);
    

    // Transform statements to RDF
    ergebnis += transformStatements(ProjectURI, ej.statements);

    // Transform hierarchies to RDF
    {/* ej.hierarchies.forEach( hierarchy => {
        
        let hierarchyUri = ProjectURI+"/"+hierarchy.id;
        ergebnis += `<${hierarchyUri}> a SpecIF:RC-Hierarchy ;
        meta:id "${hierarchy.id}" ;
        meta:resource <${ProjectURI+"/"+hierarchy.resource}> ;
        dcterms:modified "${hierarchy.changedAt}"; .
        `
    }) */}
    ergebnis += transformHierarchies(ProjectURI, ej.hierarchies);


    // Transform Files
    //ej.files.forEach( hierarchy => {  })
    ergebnis += transformFiles(ProjectURI, ej.files);

    return ergebnis;
}

isArrayWithContent = (array) => {
    return (Array.isArray(array) && array.length > 0)
}

transformDatatypes = (projectURI, datatypes) => {
    if (!isArrayWithContent(datatypes)){
        return '';
    }
}


transformPropertyClasses = (projectURI, propertyClasses) => {
    if (!isArrayWithContent(propertyClasses)){
        return '';
    }
    let propertyClassesRdfString;
    
    propertyClasses.forEach(propertyClass => {        
        let propertyClassMappingUri = projectURI+"/"+propertyClass.id;
        properties[propertyClass.id] = propertyClass.title;

        propertyClassesRdfString += `<${projectURI}> meta:containsPropertyClassMapping <${propertyClassMappingUri}> .
        
        <${propertyClassMappingUri}> a meta:PropertyClassMapping ;
                meta:id                 "${propertyClass.id}" ;
                meta:title              "${propertyClass.title}" ; # Literal
                rdfs:comment            "${propertyClass.description}" ; # Literal
                meta:vocabularyElement  ${propertyClass.title} ; # rely on prefix definitions (quick and dirty), only in Turtle syntax
                #meta:vocabularyElement <http://purl.org/dc/terms/title> ; # resolved to URI
                meta:dataType           "${propertyClass.dataType}" ;
                dcterms:modified        "${propertyClass.changedAt}" .
                
                `
    })
    return propertyClassesRdfString;
}

transformResourceClasses = (projectURI, resourceClasses) => {
    if (!isArrayWithContent(resourceClasses)){
        return '';
    }

    let resourceClassesRdfString

    resourceClasses.forEach(resourceClass => {
        let resourceClassMappingUri = projectURI+"/"+resourceClass.id;
        resourceClassesRdfString += `<${projectURI}> meta:containsResourceClassMapping <${resourceClassMappingUri}> .
    
        <${resourceClassMappingUri}> a meta:ResourceClassMapping ;
                meta:id                 "${resourceClass.id}" ;
                meta:title              "${resourceClass.title}";
                meta:vocabularyElement  ${resourceClass.title} ;
                meta:description        "${resourceClass.description}" ;
                meta:icon               "${resourceClass.icon}" ;
                dcterms:modified        "${resourceClass.changedAt}" ;
                `
        
        resourceClass.propertyClasses.forEach( proertyClass => {
            resourceClassesRdfString += `meta:propertyClasses <http://example.com/P-Requirement-with-Properties/${proertyClass}> ;
            `
        })
        resourceClassesRdfString += `.

        `
    })

    return resourceClassesRdfString;
}

transformStatementClasses = (projectURI, statementClasses) => {
    if (!isArrayWithContent(statementClasses)){
        return '';
    }
    
}

transformResources = (projectURI, resources) => {
    if (!isArrayWithContent(resources)){
        return '';
    }

    let resourcesRdfString

    resources.forEach( resource => {
        let resourceUri = projectURI+"/"+resource.id;
        
        resourcesRdfString += `<${resourceUri}> a IREB:Requirement;
                rdfs:label              "${resource.title}" ;
                dcterms:modifed         "${resource.changedAt}" ;
                `
    
        resource.properties.forEach( property => {
            resourcesRdfString +=  `${properties[property.class]} "${property.value}" ;
            `;
        })
        resourcesRdfString += `.
        `
    })

    return resourcesRdfString;
}

transformStatements = (projectURI, statements) => {
    if (!isArrayWithContent(statements)){
        return '';
    }
}

transformHierarchies = (projectURI, hierarchies) => {
    if (!isArrayWithContent(hierarchies)){
        return '';
    }

    let hierarchyRdfString

    hierarchies.forEach( hierarchy => {
        
        let hierarchyUri = projectURI+"/"+hierarchy.id;
        hierarchyRdfString += `<${hierarchyUri}> a SpecIF:RC-Hierarchy ;
                    meta:id             "${hierarchy.id}" ;
                    meta:resource       <${projectURI+"/"+hierarchy.resource}> ;
                    dcterms:modified    "${hierarchy.changedAt}"; .
                    `
    })
}

transformFiles = (projectURI, files) => {
    if (!isArrayWithContent(files)){
        return '';
    }
}


getInputValue = () => {
    element = document.getElementById("input");
    return element.value;
}

transform = () => {
    input = getInputValue();
    rdf = transformSpecifToRDF(input)
    element = document.getElementById("output");
    element.innerHTML=rdf
}




