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
    ergebnis += transformDatatypes(ej.dataTypes)

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
    ergebnis += transformPropertyClasses(ej.propertyClasses)
    

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
    ergebnis += transformResourceClasses(ej.resourceClasses)
    

    // Transform Statementclasses to RDF
    //ej.statementClasses.forEach( hierarchy => {  })
    ergebnis += transformStatementClasses(ej.statementClasses);

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
    ergebnis += transformResources(ej.resources);
    

    // Transform statements to RDF
    ergebnis += transformStatements(ej.statements);

    // Transform hierarchies to RDF
    {/* ej.hierarchies.forEach( hierarchy => {
        
        let hierarchyUri = ProjectURI+"/"+hierarchy.id;
        ergebnis += `<${hierarchyUri}> a SpecIF:RC-Hierarchy ;
        meta:id "${hierarchy.id}" ;
        meta:resource <${ProjectURI+"/"+hierarchy.resource}> ;
        dcterms:modified "${hierarchy.changedAt}"; .
        `
    }) */}
    ergebnis += transformHierarchies(ej.hierarchies);


    // Transform Files
    //ej.files.forEach( hierarchy => {  })
    ergebnis += transformFiles(ej.files);

    return ergebnis;
}

defineTurtleVocabulary = (baseUri, projectID) => {
    let RdfString = ``
    RdfString += tier0RdfEntry(`@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .`);
    RdfString += tier0RdfEntry(`@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .`);
    RdfString += tier0RdfEntry(`@prefix foaf: <http://xmlns.com/foaf/0.1/> .`);
    RdfString += tier0RdfEntry(`@prefix owl: <http://www.w3.org/2002/07/owl#> .`);
    RdfString += tier0RdfEntry(`#@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .`);
    RdfString += tier0RdfEntry(`@prefix xs: <http://www.w3.org/2001/XMLSchema#> .`);
    RdfString += tier0RdfEntry(`@prefix dcterms: <http://purl.org/dc/terms/> .`);
    RdfString += tier0RdfEntry(`@prefix vann: <http://purl.org/vocab/vann/> .`);
    RdfString += tier0RdfEntry(`@prefix foaf: <http://xmlns.com/foaf/0.1/> .`);
    RdfString += emptyLine()
    RdfString += tier0RdfEntry(`@prefix meta: <http://specif.de/v1.0/schema/meta#> .`);
    RdfString += tier0RdfEntry(`@prefix SpecIF: <http://specif.de/v1.0/schema/core#> .`);
    RdfString += tier0RdfEntry(`@prefix FMC: <http://specif.de/v1.0/schema/fmc#> .`);
    RdfString += tier0RdfEntry(`@prefix IREB: <http://specif.de/v1.0/schema/ireb#> .`);
    RdfString += tier0RdfEntry(`@prefix SysML: <http://specif.de/v1.0/schema/sysml#> .`);
    RdfString += tier0RdfEntry(`@prefix oslc: <http://specif.de/v1.0/schema/oslc#> .`);
    RdfString += tier0RdfEntry(`@prefix oslc_rm: <http://specif.de/v1.0/schema/oslc_rm#> .`);
    RdfString += tier0RdfEntry(`@prefix HIS: <http://specif.de/v1.0/schema/HIS#> .`);
    RdfString += tier0RdfEntry(`@prefix BPMN: <http://specif.de/v1.0/schema/bpmn#> .`);
    RdfString += emptyLine()
    RdfString += tier0RdfEntry(`@prefix : <${baseUri}/${projectID}/> .`);
    RdfString += tier0RdfEntry(`@prefix this: <${baseUri}/${projectID}/> .`);
    
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
    
    /* baseProjectRdfString = `
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
        
        ` */
    baseProjectRdfString = emptyLine();
    baseProjectRdfString += tier0RdfEntry(`this: a meta:Document ;`);
    baseProjectRdfString += project.id ? tier1RdfEntry(`meta:id "${project.id}" ;`) : ``;
    baseProjectRdfString += project.title ? tier1RdfEntry(`rdfs:label "${project.title}" ;`) : ``;
    baseProjectRdfString += project.description ? tier1RdfEntry(`rdfs:comment "${project.description}" ;`) : ``;
    baseProjectRdfString += project.$schema ? tier1RdfEntry(`meta:schema <${project.$schema}> ;`) : ``;
    baseProjectRdfString += project.generator ? tier1RdfEntry(`meta:generator "${project.generator}" ;`) : ``;
    baseProjectRdfString += project.generatorVersion ? tier1RdfEntry(`meta:generatorVersion "${project.generatorVersion}" ;`) : ``;
    baseProjectRdfString += project.rights.title ? tier1RdfEntry(`meta:rights-title "${project.rights.title}" ;`) : ``;
    baseProjectRdfString += project.rights.type ? tier1RdfEntry(`meta:rights-type "${project.rights.type}" ;`) : ``;
    baseProjectRdfString += project.rights.url ? tier1RdfEntry(`meta:rights-url "${project.rights.url}" ;`) : ``;
    baseProjectRdfString += project.createdAt ? tier1RdfEntry(`dcterms:modified "${project.createdAt}" ;`) : ``;
    baseProjectRdfString += project.createdBy.familyName ? tier1RdfEntry(`meta:createdBy-familyName "${project.createdBy.familyName}" ;`) : ``;
    baseProjectRdfString += project.createdBy.givenName ? tier1RdfEntry(`meta:createdBy-givenName "${project.createdBy.givenName}" ;`) : ``;
    baseProjectRdfString += project.createdBy.email.value ? tier1RdfEntry(`meta:createdBy-email "${project.createdBy.email.value}" ;`) : ``;
    baseProjectRdfString += project.createdBy.org.organizationName ? tier1RdfEntry(`meta:createdBy-org-organizationName "${project.createdBy.org.organizationName}" ;`) : ``;
    baseProjectRdfString += ' .';
        
    return baseProjectRdfString;
}

transformDatatypes = (dataTypes) => {
    if (!isArrayWithContent(dataTypes)){
        return '';
    }
    
    /* {
			"id": "DT-Byte",
			"title": "Byte",
			"type": "xs:integer",
			"minInclusive": 0,
			"maxInclusive": 255,
			"revision": "1",
            "changedAt": "2016-05-26T08:59:00+02:00",
            
        } 
        
        this: meta:containsDataTypeMapping :DT-Byte .
        :DT-Byte a meta:DataTypeMapping ;
            meta:id "DT-Byte" ;
            rdfs:label "Byte" ;
            meta:type "xs:integer" ; 
            meta:vocabularyElement xs:integer ;
            meta:revision "1" ;
            meta:minInclusive "0" ;
            meta:maxInclusive "255" ;
            dcterms:modified "2016-05-26T08:59:00+02:00" .
        */

    let dataTypesRdfString = '';

    dataTypes.forEach( dataType => {
        dataTypeRdfString = emptyLine();

        dataTypeRdfString += dataType.id ? tier0RdfEntry(`this: meta:containsDataTypeMapping :${dataType.id} .`) : '';
        dataTypeRdfString += dataType.id ? tier0RdfEntry(`:${dataType.id} a meta:DataTypeMapping , owl:Class ;`) : '';
        dataTypeRdfString += dataType.id ? tier1RdfEntry(`meta:id "${dataType.id}" ;`) : '';
        dataTypeRdfString += dataType.title ? tier1RdfEntry(`rdfs:label "${dataType.title}" ;`) : '';
        dataTypeRdfString += dataType.type ? tier1RdfEntry(`meta:type "${dataType.type}" ; `) : '';
        dataTypeRdfString += dataType.type ? tier1RdfEntry(`meta:vocabularyElement ${dataType.type} ;`) : '';
        dataTypeRdfString += dataType.revision ? tier1RdfEntry(`meta:revision "${dataType.revision}" ;`) : '';
        dataTypeRdfString += dataType.maxLength ? tier1RdfEntry(`meta:maxLength "${dataType.maxLength}" ;`) : '';
        dataTypeRdfString += dataType.fractionDigits ? tier1RdfEntry(`meta:fractionDigits "${dataType.fractionDigits}" ;`) : '';
        dataTypeRdfString += dataType.minInclusive ? tier1RdfEntry(`meta:minInclusive "${dataType.minInclusive}" ;`) : '';
        dataTypeRdfString += dataType.maxInclusive ? tier1RdfEntry(`meta:maxInclusive "${dataType.maxInclusive}" ;`) : '';
        dataTypeRdfString += dataType.changedAt ? tier1RdfEntry(`dcterms:modified "${dataType.changedAt}" ;`) : '';
        dataTypeRdfString += ' .';
    
        dataTypesRdfString += dataTypeRdfString;
        if(isArrayWithContent(dataType.values)){
            dataType.values.forEach( enumValue => {
                enumRdfString = emptyLine();
                
                enumRdfString += dataType.title ? tier0RdfEntry(`:${enumValue.id} a ${dataType.title} ;`) : '';
                enumRdfString += dataType.id ? tier1RdfEntry(`meta:id "${dataType.id}" ;`) : '';
                enumRdfString += dataType.value ? tier1RdfEntry(`rdfs:label "${dataType.value}" ;`) : '';
                enumRdfString += " ."
                dataTypesRdfString += enumRdfString;
            })
        }
    })

    return dataTypesRdfString;
}


transformPropertyClasses = (propertyClasses) => {
    if (!isArrayWithContent(propertyClasses)){
        return '';
    }
    let propertyClassesRdfString = '';
    
    propertyClasses.forEach(propertyClass => {        
        propertyClassRdfString = emptyLine();
        
        propertyClassRdfString += propertyClass.id ? tier0RdfEntry(`this: meta:containsPropertyClassMapping :${propertyClass.id} .`) : '';
        propertyClassRdfString += propertyClass.id ? tier0RdfEntry(`:${propertyClass.id} a meta:PropertyClassMapping ;`) : '';
        propertyClassRdfString += propertyClass.id ? tier1RdfEntry(`meta:id "${propertyClass.id}" ;`) : '';
        propertyClassRdfString += propertyClass.title ? tier1RdfEntry(`meta:title "${propertyClass.title}" ; `) : '';
        propertyClassRdfString += propertyClass.title ? tier1RdfEntry(`meta:vocabularyElement ${propertyClass.title} ;`) : '';
        propertyClassRdfString += propertyClass.dataType ? tier1RdfEntry(`meta:dataType "${propertyClass.dataType}" ;`) : '';
        propertyClassRdfString += propertyClass.revision ? tier1RdfEntry(`meta:revision "${propertyClass.revision}" ;`) : '';
        propertyClassRdfString += propertyClass.changedAt ? tier1RdfEntry(`dcterms:modified "${propertyClass.changedAt}" ;`) : '';
        propertyClassesRdfString += ' .'
        propertyClassesRdfString += propertyClassRdfString
    })
    return propertyClassesRdfString;
}

transformResourceClasses = (resourceClasses) => {
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
        resourceClassRdfString = emptyLine();

        resourceClassRdfString += resourceClass.id ? tier0RdfEntry(`this: meta:containsResourceClassMapping :${resourceClass.id} .`):'';
        resourceClassRdfString += resourceClass.id ? tier0RdfEntry(`:${resourceClass.id} a meta:ResourceClassMapping ;`):'';
        resourceClassRdfString += resourceClass.id ? tier1RdfEntry(`meta:id "${resourceClass.id}" ;`):'';
        resourceClassRdfString += resourceClass.id ? tier1RdfEntry(`meta:title "${resourceClass.title}";`):'';
        resourceClassRdfString += resourceClass.id ? tier1RdfEntry(`meta:vocabularyElement ${resourceClass.title} ;`):'';
        resourceClassRdfString += resourceClass.id ? tier1RdfEntry(`meta:description "${resourceClass.description}" ;`):'';
        resourceClassRdfString += resourceClass.id ? tier1RdfEntry(`meta:icon "${resourceClass.icon}" ;`):'';
        resourceClassRdfString += resourceClass.instantiation ? tier1RdfEntry(`meta:instantiation "${resourceClass.instantiation}" ;`):'';
        resourceClassRdfString += resourceClass.changedAt ? tier1RdfEntry(`dcterms:modified "${resourceClass.changedAt}" ;`):'';
        resourceClassRdfString += resourceClass.revision ? tier1RdfEntry(`meta:revision "${resourceClass.revision}" ;`):'';

        if (isArrayWithContent(resourceClass.instantiation)){
            let instantiationRDFString =tier1RdfEntry(`meta:instantiation`);
            resourceClass.instantiation.forEach( instantiation => {
                instantiationRDFString += tier2RdfEntry(`"${instantiation}" ,`);
            })
            resourceClassRdfString+=instantiationRDFString.replace(/,([^,]*)$/, ';');
        }

        if (isArrayWithContent(resourceClass.instantiation)){
            let propertyClassRdfString = tier1RdfEntry(`meta:propertyClasses `);
            resourceClass.propertyClasses.forEach( propertyClass => {
                propertyClassRdfString += tier2RdfEntry(`:${propertyClass} ,`);
            })
            resourceClassRdfString+=propertyClassRdfString.replace(/,([^,]*)$/, ';');
        }

        resourceClassRdfString+= ' .'

        resourceClassesRdfString+=resourceClassRdfString

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

transformStatementClasses = (statementClasses) => {
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
        statementClassRDFString = emptyLine();
        
        statementClassRDFString += statementClass.id ? tier0RdfEntry(`:${statementClass.id} a meta:StatementClassMapping ;`) : '';
        statementClassRDFString += statementClass.id ? tier0RdfEntry(`meta:id "${statementClass.id}" ;`) : '';
        statementClassRDFString += statementClass.title ? tier1RdfEntry(`rdfs:label  "${statementClass.title}" ;`) : '';
        statementClassRDFString += statementClass.id ? tier1RdfEntry(`meta:vocabularyElement ${statementClass.id} ;`) : '';
        statementClassRDFString += statementClass.description ? tier1RdfEntry(`rdfs:comment "${statementClass.description}" ;`) : '';
        statementClassRDFString += statementClass.revision ? tier1RdfEntry(`meta:revision: "${statementClass.revision}" ;`) : '';
        statementClassRDFString += statementClass.changedAt ? tier1RdfEntry(`dcterms:modified "${statementClass.changedAt}" ;`) : '';

        if(isArrayWithContent(statementClass.instantiation)){
                let instantiationRDFString = tier1RdfEntry(`meta:instantiation`);
                statementClass.instantiation.forEach( instantiation => {
                    instantiationRDFString += tier2RdfEntry(`"${instantiation}" ,`);
                })
                statementClassRDFString+=instantiationRDFString.replace(/,([^,]*)$/, ';');
        }

        if(isArrayWithContent(statementClass.subjectClasses)){
            let subjectClassesRDFString =tier1RdfEntry(`meta:subjectClasses`);
            statementClass.subjectClasses.forEach( subjectClass => {
                subjectClassesRDFString += tier2RdfEntry(`:${subjectClass} ,`);
            })
            statementClassRDFString+=subjectClassesRDFString.replace(/,([^,]*)$/, ';');
        }

        if(isArrayWithContent(statementClass.objectClasses)){
            let objectClassesRDFString =tier1RdfEntry(`meta:objectClasses `);
            statementClass.objectClasses.forEach( objectClass => {
                objectClassesRDFString += tier2RdfEntry(`:${objectClass} ,`);
            })
            statementClassRDFString+=objectClassesRDFString.replace(/,([^,]*)$/, ';');
        }
        statementClassRDFString += (' .')
        statementClassesRDFString += statementClassRDFString;
        })
    
    return statementClassesRDFString;
    
}

transformResources = (resources) => {
    if (!isArrayWithContent(resources)){
        return '';
    }

    let resourcesRdfString = ''

    /* 
    {
        "id": "Fld-5a5f54090000bca801375b04a668f1a7",
        "title": "System Composition",
        "class": "RC-Fld",
        "properties": [{
            "class": "PC-Name",
            "value": "System Composition"
        }, {
            "class": "PC-Text",
            "value": "<div><p>.. showing the system and its composition of modules (at a higher level) and components (at a lower level). The relevant interfaces between the disciplines mechanical, electrical and software engineering are shown.</p> </div>"
        }],
        "revision": "13",
        "changedAt": "2017-06-19T20:13:02+02:00",
        "changedBy": "od"
    }

    :Req-d1c895230000c3a80150f8afd049f738 a IREB:Requirement ;
    rdfs:label "Dim an electric load" ;
    meta:id "Req-d1c895230000c3a80150f8afd049f738" ;
    dcterms:title "Dim an electric load" ;
    dcterms:description "<div><p> The user can set the intensity level of an electric load such as a light [[bulb]]. Pressing a button 'up' or 'down', the intensity is increased or decreased following a quasi-stepless ramp. <br /></p></div>" ;
    HIS:supplierStatus :V-supplier-status-2 ;
    HIS:supplierComment "Our solution does this perfectly." ;
    meta:revision "23" ;
    dcterms:modified "2017-06-19T20:13:06+02:00" ;
    meta:changedBy "od" .
    */

    resources.forEach( resource => {
        resourceRdfString = emptyLine();
        
        resourceRdfString += resource.id ? tier0RdfEntry(`:${resource.id} a IREB:Requirement ;`) : '';
        resourceRdfString += resource.title ? tier1RdfEntry(`rdfs:label "${resource.title}" ;`) : '';
        resourceRdfString += resource.id ? tier1RdfEntry(`meta:id "${resource.id}" ;`) : '';
        resourceRdfString += resource.class ? tier1RdfEntry(`meta:PropertyClassMapping "${resource.class}" ;`) : '';
        if(isArrayWithContent(resource.properties)){
            resource.properties.forEach( property => {
                resourceRdfString += tier1RdfEntry(`:${property.class} "${property.value}" ;`);
            })
        }
        resourceRdfString += resource.revision ? tier1RdfEntry(`meta:revision "${resource.revision}" ;`) : '';
        resourceRdfString += resource.changedAt ? tier1RdfEntry(`dcterms:modified "${resource.changedAt}" ;`) : '';
        resourceRdfString += resource.changedBy ? tier1RdfEntry(`meta:changedBy "${resource.changedBy}" ;`) : '';
        resourceRdfString += ' .'

        resourcesRdfString += resourceRdfString;
    })

    return resourcesRdfString;
}

transformStatements = (statements) => {
    if (!isArrayWithContent(statements)){
        return '';
    }

    /* :RVis-Pln-5a4755dd0000bca801375293a62c90a8-MEl-5bd6bd890000bca8013739588a3f43d6 a meta:Statement ;
    meta:id "RVis-Pln-5a4755dd0000bca801375293a62c90a8-MEl-5bd6bd890000bca8013739588a3f43d6" ;
    rdf:subject :Pln-5a4755dd0000bca801375293a62c90a8 ;
    rdf:predicate :SC-Visibility ;
    rdf:object :MEl-5bd6bd890000bca8013739588a3f43d6 ;
    meta:modified "2017-06-19T20:13:33+02:00" ;
    meta:changedBy "od" ;
    meta:revision "93" ;
  . */

  /* {
		"id": "RVis-Pln-5a4755dd0000bca801375293a62c90a8-MEl-5bd6bd890000bca8013739588a3f43d6",
		"class": "SC-Visibility",
		"revision": "93",
		"changedAt": "2017-06-19T20:13:33+02:00",
		"changedBy": "od",
		"subject": "Pln-5a4755dd0000bca801375293a62c90a8",
		"object": "MEl-5bd6bd890000bca8013739588a3f43d6"
		} */

    let statementsRdfString = ``
    
    statements.forEach( statement => {
        statementRdfString = emptyLine();

        statementRdfString += statement.id ? tier0RdfEntry(`:${statement.id} a meta:Statement ;`) : '';
        statementRdfString += statement.id ? tier1RdfEntry(`meta:id "${statement.id}" ;`) : '';
        statementRdfString += statement.subject ? tier1RdfEntry(`rdf:subject :${statement.subject} ;`) : '';
        statementRdfString += statement.class ? tier1RdfEntry(`rdf:predicate :${statement.class} ;`) : '';
        statementRdfString += statement.object ? tier1RdfEntry(`rdf:object :${statement.object} ;`) : '';
        statementRdfString += statement.changedAt ? tier1RdfEntry(`meta:modified "${statement.changedAt}" ;`) : '';
        statementRdfString += statement.changedBy ? tier1RdfEntry(`meta:changedBy "${statement.changedBy}" ;`) : '';
        statementRdfString += statement.revision ? tier1RdfEntry(`meta:revision "${statement.revision}" ;`) : '';
        statementRdfString += ' .'

        statementsRdfString += statementRdfString;
    })

    return statementsRdfString;
}

transformHierarchies = (hierarchies) => {
    if (!isArrayWithContent(hierarchies)){
        return '';
    }

    let hierarchyRdfString = ''

    hierarchies.forEach( node => {
        hierarchyRdfString+=transformNodes(node)
    })

    return hierarchyRdfString
}

transformNodes = (hierarchyNode) => {
    
    let hierarchyNodeRdfString = emptyLine();
    hierarchyNodeRdfString += tier0RdfEntry(`:${hierarchyNode.id} a SpecIF:RC-Hierarchy ;`)
    hierarchyNodeRdfString += tier1RdfEntry(`eta:id "${hierarchyNode.id}" ;`)
    hierarchyNodeRdfString += tier1RdfEntry(`eta:resource "${hierarchyNode.id}" ;`)
    hierarchyNodeRdfString += tier1RdfEntry(`eta:revision "${hierarchyNode.id}" ;`)
    hierarchyNodeRdfString += tier1RdfEntry(`cterms:modified "${hierarchyNode.id}" ;`)
    
    if(isArrayWithContent(hierarchyNode.nodes)){
        NodeRdfString = tier1RdfEntry(`meta:nodes`);
        hierarchyNode.nodes.forEach( node => {
            NodeRdfString += tier2RdfEntry(`${node.id} ,` );
        })
        hierarchyNodeRdfString+=NodeRdfString.replace(/,([^,]*)$/, ';')
        hierarchyNodeRdfString += ` .`        

        hierarchyNode.nodes.forEach( node => {
            hierarchyNodeRdfString += transformNodes(node); 
        })
        return hierarchyNodeRdfString
    } else {
        hierarchyNodeRdfString += ` .`
        return hierarchyNodeRdfString
    }
    
}

transformFiles = (files) => {
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
        fileRdfString = emptyLine(); 
        fileRdfString += file.id ? tier0RdfEntry(`:${file.id} a meta:File ;`) : '';
        fileRdfString += file.id ? tier1RdfEntry(`meta:id "${file.id}" ;`) : '';
        fileRdfString += file.title ? tier1RdfEntry(`rdfs:label "${file.title}" ;`) : '';
        fileRdfString += file.type ? tier1RdfEntry(`meta:type "${file.type}" ;`) : '';
        fileRdfString += file.changedAt ? tier1RdfEntry(`dcterms:modified "${file.changedAt}" ;`) : '';
        fileRdfString += ' .'
        filesRdfString += fileRdfString;
    })

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
/* 
########################## String #########################################
 */

tier0RdfEntry = (content) => {
    return `\n${content}`
} 

tier1RdfEntry = (content) => {
    return `\n\t${content}`
}

tier2RdfEntry = (content) => {
    return `\n\t\t${content}`
}

tier3RdfEntry = (content) => {
    return `\n\t\t\t${content}`
}

emptyLine = () => {
    return `\n`
}