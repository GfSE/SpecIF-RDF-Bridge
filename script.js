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

    let ergebnis = '';
    /* `@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
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
    
    ` */

    let base = 'http://example.com/'
    let projectID = ej.id
    let ProjectURI = base+projectID
    
    //Mapping of the properyClasses
    // properties get extracted from PropertyClasses and are used
    // in Resources. 
    properties = [];

{
/* 
    ---Required Values---
    $schema
    id 
    title 
    resourceClasses
    statementClasses
    resources
    statements
    hierarchies

    ---Optional Values---
    description
    isExtension -> bool
    generator -> string
    generatorVersion -> string
    rights -> {
        *title -> string
        *type -> string
        *url -> string
    }
    createdAt -> dateTime
    createdBy -> {
        familyName -> string
        givenName -> string
        org -> {
            *organizationName-> string
        }
        *email -> {
            type -> string
            *value -> string
        }
    }
    language -> string
    dataTypes -> [
        
    ]
    propertyClasses
    files */
}


    
    // Setting ProjectSctructure id -> title
    /* ergebnis += `<${ProjectURI}> a meta:Document ;
            rdfs:label "${ej.title}" .`
    //      dcterms:modified ej.createdAt
    //      dcterms:schema ej.$schema */
    ergebnis += defineTurtleVocabulary("https://example.com", ej.id)


    ergebnis += transformProjectBaseInformations(ej);
    
    // Transform Datatypes to RDF
    //ej.dataTypes.forEach( hierarchy => {  })
    //ergebnis += transformDatatypes(ProjectURI, ej.dataTypes)

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
    //ergebnis += transformPropertyClasses(ProjectURI, ej.propertyClasses)
    

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
    //ergebnis += transformResources(ProjectURI, ej.resources);
    

    // Transform statements to RDF
    //ergebnis += transformStatements(ProjectURI, ej.statements);

    // Transform hierarchies to RDF
    {/* ej.hierarchies.forEach( hierarchy => {
        
        let hierarchyUri = ProjectURI+"/"+hierarchy.id;
        ergebnis += `<${hierarchyUri}> a SpecIF:RC-Hierarchy ;
        meta:id "${hierarchy.id}" ;
        meta:resource <${ProjectURI+"/"+hierarchy.resource}> ;
        dcterms:modified "${hierarchy.changedAt}"; .
        `
    }) */}
    //ergebnis += transformHierarchies(ProjectURI, ej.hierarchies);


    // Transform Files
    //ej.files.forEach( hierarchy => {  })
    ergebnis += transformFiles(ProjectURI, ej.files);

    return ergebnis;
}

defineTurtleVocabulary = (baseUri, projectID) => {
    let RdfString = `
    @prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
    @prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .
    @prefix foaf: <http://xmlns.com/foaf/0.1/> .
    @prefix owl: <http://www.w3.org/2002/07/owl#> .
    #@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .
    @prefix xs: <http://www.w3.org/2001/XMLSchema#> .
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

    @prefix : <${baseUri}/${projectID}/> .
    @prefix this: <${baseUri}/${projectID}/> .
    `
    return RdfString;
}

transformProjectBaseInformations = (project) => {
    let baseProjectRdfString;

    /* "id": "ACP-59c8a7730000bca80137509a49b1218b",
	"title": "Dimmer - Semantically Integrated Specification (2020-08-19)",
	"description": "This specification method integrates and represents:\n- processes, system composition and requirements (dynamic, static and detail views)\n- mechanic, electric and software components with their interfaces.\n\nIt is important to understand, that all plans (diagrams) are views of a common system engineering model, sometimes called 'system repository'. Thus, consistency is always maintained.\n\nThe model elements are connected with relations, most of which are defined by positioning graph elements. For example, if a system component is drawn within another, a relationship 'contains' is created in the logic representation of the engineering model. Other relations, such as a system component 'complies-with' a requirement are created manually.  \n\nAlso, the documents are generated from the system engineering model. The ordering is in most projects (it can be rearranged, however, if appropriate):\n- All plans\n- A glossary with descriptions of all model elements appearing on one or more plans\n- A hierarchically ordered list of requirements\n- A list of open issues.\nPlease note that plans list related model elements and model elements list related requirements .. and vice versa. Active hyper-links are used, so that it is easy to jump between related model elements.\n\nFurther information is given in Appendix 'Method'.",
    "$schema": "https://specif.de/v1.0/schema.json",
	"generator": "Interactive-Spec",
	"generatorVersion": "0.95.3",
	"rights": {
		"title": "Creative Commons 4.0 CC BY-SA",
		"type": "dcterms:rights",
		"url": "https://creativecommons.org/licenses/by-sa/4.0/"
	},
	"createdAt": "2019-05-04T19:08:31.960Z",
	"createdBy": {
		"familyName": "von Dungern",
		"givenName": "Oskar",
		"email": {
			"type": "text/html",
			"value": "oskar.dungern@adesso.de"
		},
		"org": {
			"organizationName": "adesso"
		}
    }, */
    
    /* this: a meta:Document ;
            meta:id "ACP-59c8a7730000bca80137509a49b1218b" ;
            rdfs:label "Dimmer - Semantically Integrated Specification (2020-08-19)" ;
            rdfs:comment "This specification method integrates and represents:\n- processes, system composition and requirements (dynamic, static and detail views)\n- mechanic, electric and software components with their interfaces.\n\nIt is important to understand, that all plans (diagrams) are views of a common system engineering model, sometimes called 'system repository'. Thus, consistency is always maintained.\n\nThe model elements are connected with relations, most of which are defined by positioning graph elements. For example, if a 1system component is drawn within another, a relationship 'contains' is created in the logic representation of the engineering model. Other relations, such as a system component 'complies-with' a requirement are created manually.  \n\nAlso, the documents are generated from the system engineering model. The ordering is in most projects (it can be rearranged, however, if appropriate):\n- All plans\n- A glossary with descriptions of all model elements appearing on one or more plans\n- A hierarchically ordered list of requirements\n- A list of open issues.\nPlease note that plans list related model elements and model elements list related requirements .. and vice versa. Active hyper-links are used, so that it is easy to jump between related model elements.\n\nFurther information is given in Appendix 'Method'." ;
            meta:schema <https://specif.de/v1.0/schema.json> ;
            meta:generator "Interactive-Spec" ;
            meta:generatorVersion "0.95.3" ;
            meta:rights-title "Creative Commons 4.0 CC BY-SA" ;
            meta:rights-type "dcterms:rights" ;
            meta:rights-url "https://creativecommons.org/licenses/by-sa/4.0/" ;
            dcterms:modified "2019-05-04T19:08:31.960Z" ;
            meta:createdBy-familyName "von Dungern" ;
            meta:createdBy-givenName "Oskar" ;
            meta:createdBy-email "oskar.dungern@adesso.de" ;
            meta:createdBy-org-organizationName "adesso" . */
    
    baseProjectRdfString = `
    this: a meta:Document ;
        meta:id "${project.id}" ;
        rdfs:label "${project.title}" ;
        rdfs:comment "${project.description}" ;
        meta:schema <${project.$schema}> ;
        meta:generator "${project.generator}" ;
        meta:generatorVersion "${project.generatorVersion}" ;
        meta:rights-title "${project.rights.title}" ;
        meta:rights-type "${project.rights.type}" ;
        meta:rights-url "${project.rights.url}" ;
        dcterms:modified "${project.createdAt}" ;
        meta:createdBy-familyName "${project.createdBy.familyName}" ;
        meta:createdBy-givenName "${project.createdBy.givenName}" ;
        meta:createdBy-email "${project.createdBy.email.value}" ;
        meta:createdBy-org-organizationName "${project.createdBy.org.organizationName}" .
        
        `
        return baseProjectRdfString;
}

transformDatatypes = (projectURI, datatypes) => {
    if (!isArrayWithContent(datatypes)){
        return '';
    }

    return '';
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
    
    /* this: meta:containsResourceClassMapping :RC-Req .
  :RC-Req a meta:ResourceClassMapping ;
    meta:id "RC-Req" ;
    meta:title "IREB:Requirement";
    meta:vocabularyElement IREB:Requirement ;
    meta:description "A 'Requirement' is a singular documented physical and functional need that a particular design, product or process must be able to perform." ;
    meta:icon "&#8623;" ;
    meta:instantiation "user" ;
    dcterms:modified "2016-05-26T08:59:00+02:00" ;
    meta:propertyClasses 
      :PC-Name ,
      :PC-Description ,
      :PC-SupplierStatus ,
      :PC-SupplierComment ,
      :PC-OemStatus ,
      :PC-OemComment ;
    meta:revision "1" ;
  . */


 /*  {
    "id": "RC-Req",
    "title": "IREB:Requirement",
    "description": "A 'Requirement' is a singular documented physical and functional need that a particular design, product or process must be able to perform.",
    "icon": "&#8623;",
    "instantiation": ["user"],
    "propertyClasses": ["PC-VisibleId", "PC-Name", "PC-Text", "PC-Status", "PC-Priority", "AT-Req-perspective", "AT-Req-discipline", "PC-SupplierStatus", "PC-SupplierComment", "PC-OemStatus", "PC-OemComment"],
    "revision": "1",
    "changedAt": "2016-05-26T08:59:00+02:00"
} */

    let resourceClassesRdfString=``;

    resourceClasses.forEach( resourceClass => {
        resourceClassesRdfString+=`:${resourceClass.id} a meta:ResourceClassMapping ;
        meta:id "${resourceClass.id}" ;
        meta:title "${resourceClass.id}";
        meta:vocabularyElement ${resourceClass.id} ;
        meta:description "${resourceClass.id}" ;
        meta:icon "${resourceClass.id}" ;
        meta:instantiation "${resourceClass.id}" ;
        dcterms:modified "${resourceClass.id}" ;
        meta:revision "${resourceClass.id}" ;`

        let propertyClassRdfString = `\n\tmeta:propertyClasses `
        resourceClass.propertyClasses.forEach( propertyClass => {
            propertyClassRdfString += `\n\t\t:${propertyClass},`
        })
        resourceClassesRdfString+=propertyClassRdfString.replace(/,([^,]*)$/, ';')
        resourceClassesRdfString+=`\n\n`

    })

    /* resourceClasses.forEach(resourceClass => {
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
    })*/

    return resourceClassesRdfString;
}

transformStatementClasses = (projectURI, statementClasses) => {
    if (!isArrayWithContent(statementClasses)){
        return '';
    }

    /* :SC-Visibility a meta:StatementClassMapping ;
    meta:id "SC-Visibility" ;
    rdfs:label  "SpecIF:shows" ;
    meta:vocabularyElement SpecIF:SC-shows ;
    rdfs:comment "Relation: Plan shows Model-Element" ;
    meta:instantiation "auto" ;
    meta:revision: "1" ;
    dcterms:modified "2016-05-26T08:59:00+02:00" ;
    meta:subjectClasses :RC-Pln ;
    meta:objectClasses 
      :RC-Act ,
      :RC-Sta ,
      :RC-Evt ;
  . */

  /* {
    "id": "SC-Visibility",
    "title": "SpecIF:shows",
    "description": "Relation: Plan shows Model-Element",
    "instantiation": ["auto"],
    "revision": "1",
    "changedAt": "2016-05-26T08:59:00+02:00",
    "subjectClasses": ["RC-Pln"],
    "objectClasses": ["RC-Act", "RC-Sta", "RC-Evt"]
    } */
    
    let statementClassesRDFString = ``;

    statementClasses.forEach( statementClass => {
        statementClassesRDFString +=
        `:${statementClass.id} a meta:StatementClassMapping ;
        meta:id "${statementClass.id}" ;
        rdfs:label  "${statementClass.title}" ;
        meta:vocabularyElement ${statementClass.id} ;
        rdfs:comment "${statementClass.description}" ;
        meta:revision: "${statementClass.revision}" ;
        dcterms:modified "${statementClass.changedAt}" ;` 

        let instantiationRDFString =`\n\tmeta:instantiation`
        statementClass.instantiation.forEach( instantiation => {
            instantiationRDFString += `\n\t\t"${instantiation}",`
        })
        statementClassesRDFString+=instantiationRDFString.replace(/,([^,]*)$/, ';')


        let subjectClassesRDFString =`\n\tmeta:subjectClasses`
        statementClass.subjectClasses.forEach( subjectClass => {
            subjectClassesRDFString += `\n\t\t:${subjectClass},`
        })
        statementClassesRDFString+=subjectClassesRDFString.replace(/,([^,]*)$/, ';')


        let objectClassesRDFString =`\n\tmeta:objectClasses `
        statementClass.objectClasses.forEach( objectClass => {
            objectClassesRDFString += `\n\t\t:${objectClass},`
        })
        statementClassesRDFString+=objectClassesRDFString.replace(/,([^,]*)$/, ';')
        statementClassesRDFString+=`\n\n`
        
    })
    


    return statementClassesRDFString;
    
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

    return '';
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

    return hierarchyRdfString
}

transformFiles = (projectURI, files) => {
    if (!isArrayWithContent(files)){
        return '';
    }

    /* input 
    "files": [{
		"id": "F-67845657",
		"title": "files_and_images/27420ffc0000c3a8013ab527ca1b71f5.svg",
		"type": "image/svg+xml",
		"changedAt": "2018-11-24T17:49:22.000Z"
	}, ...    
    */

    /* output RDF
    :F-67845657 a meta:File ;
	    meta:id "F-67845657" ;
	    rdfs:label "files_and_images/27420ffc0000c3a8013ab527ca1b71f5.svg" ;
	    meta:type "image/svg+xml" ;
	    dcterms:modified "2018-11-24T17:49:22.000Z" .    
    */
    let filesRdfString = ``;
    files.forEach( file => {
filesRdfString += 
`:${file.id} a meta:File ;
    meta:id "${file.id}" ;
    rdfs:label "${file.title}" ;
    meta:type "${file.type}" ;
    dcterms:modified "${file.changedAt}" .

`})
    return filesRdfString;
}

/* 
##########################################################################
########################## Tools #########################################
##########################################################################
*/

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

isArrayWithContent = (array) => {
    return (Array.isArray(array) && array.length > 0)
}
