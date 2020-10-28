transformSpecifToRDF = (SpecIfObject) => {
    let ej= JSON.parse(SpecIfObject)
    
    let base = 'http://example.com/'
    let projectID = ej.id
    
    resultRdfString = defineTurtleVocabulary(base, projectID)
    resultRdfString += transformProjectBaseInformations(ej);    
    resultRdfString += transformDatatypes(ej.dataTypes)
    resultRdfString += transformPropertyClasses(ej.propertyClasses)    
    resultRdfString += transformResourceClasses(ej.resourceClasses)    
    resultRdfString += transformStatementClasses(ej.statementClasses);
    resultRdfString += transformResources(ej.resources);
    resultRdfString += transformStatements(ej.statements);
    resultRdfString += transformHierarchies(ej.hierarchies);
    resultRdfString += transformFiles(ej.files);
    return resultRdfString;
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
        resourceClassRdfString += resourceClass.instantiation ? extractRdfFromSpecifObjectArray(`meta:instantiation`,resourceClass.instantiation) : '';
        resourceClassRdfString += resourceClass.propertyClasses ? extractRdfFromSpecifObjectArray(`meta:propertyClasses`,resourceClass.propertyClasses) : '';
        resourceClassRdfString+= ' .'

        resourceClassesRdfString+=resourceClassRdfString

    })

    return resourceClassesRdfString;
}

transformStatementClasses = (statementClasses) => {
    if (!isArrayWithContent(statementClasses)){
        return '';
    }

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
        statementClassRDFString += statementClass.instantiation ? extractRdfFromSpecifObjectArray(`meta:instantiation`,statementClass.instantiation) : '';
        statementClassRDFString += statementClass.subjectClasses ? extractRdfFromSpecifObjectArray(`meta:subjectClasses`,statementClass.subjectClasses) : '';
        statementClassRDFString += statementClass.objectClasses ? extractRdfFromSpecifObjectArray(`meta:objectClasses `,statementClass.objectClasses) : '';

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
        hierarchyNodeRdfString += NodeRdfString.replace(/,([^,]*)$/, ';')
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

isArrayWithContent = (array) => {
    return (Array.isArray(array) && array.length > 0)
}

extractRdfFromSpecifObjectArray = (predicate, objectArray) => {
    let RdfString = '';
    if(isArrayWithContent(objectArray)){
        RdfString = tier1RdfEntry(predicate);
        objectArray.forEach( object => {
            RdfString += tier2RdfEntry(`:${object} ,`);
        })
        RdfString=RdfString.replace(/,([^,]*)$/, ';');
    }
    return RdfString
}

/* 
############################ UI ###########################################
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