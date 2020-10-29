transformSpecifToRDF = (SpecIfObject) => {
    let ej= JSON.parse(SpecIfObject)
    let {id,dataTypes,propertyClasses,resourceClasses,statementClasses,resources,statements,hierarchies,files} = ej;
    let base = 'http://example.com/'
    let projectID = id
    
    resultRdfString = defineTurtleVocabulary(base, projectID)
    resultRdfString += transformProjectBaseInformations(ej);    
    resultRdfString += transformDatatypes(dataTypes)
    resultRdfString += transformPropertyClasses(propertyClasses)    
    resultRdfString += transformResourceClasses(resourceClasses)    
    resultRdfString += transformStatementClasses(statementClasses);
    resultRdfString += transformResources(resources);
    resultRdfString += transformStatements(statements);
    resultRdfString += transformHierarchies(hierarchies);
    resultRdfString += transformFiles(files);
    return resultRdfString;
}

defineTurtleVocabulary = (baseUri, projectID) => {
    RdfString = tier0RdfEntry(`@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .`);
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
    let { id ,  title , description , $schema , generator , generatorVersion , rights , createdAt , createdBy } = project;

    baseProjectRdfString = emptyLine();
    baseProjectRdfString += tier0RdfEntry(`this: a meta:Document ;`);
    baseProjectRdfString += id ? tier1RdfEntry(`meta:id '${escapeSpecialCharaters(id)}' ;`) : ``;
    baseProjectRdfString += title ? tier1RdfEntry(`rdfs:label '${escapeSpecialCharaters(title)}' ;`) : ``;
    baseProjectRdfString += description ? tier1RdfEntry(`rdfs:comment '${escapeSpecialCharaters(description)}' ;`) : ``;
    baseProjectRdfString += $schema ? tier1RdfEntry(`meta:schema <${$schema}> ;`) : ``;
    baseProjectRdfString += generator ? tier1RdfEntry(`meta:generator '${escapeSpecialCharaters(generator)}' ;`) : ``;
    baseProjectRdfString += generatorVersion ? tier1RdfEntry(`meta:generatorVersion '${escapeSpecialCharaters(generatorVersion)}' ;`) : ``;
    if(rights){
        baseProjectRdfString += rights.title ? tier1RdfEntry(`meta:rights-title '${escapeSpecialCharaters(rights.title)}' ;`) : ``;
        baseProjectRdfString += rights.type ? tier1RdfEntry(`meta:rights-type '${escapeSpecialCharaters(rights.type)}' ;`) : ``;
        baseProjectRdfString += rights.url ? tier1RdfEntry(`meta:rights-url '${escapeSpecialCharaters(rights.url)}' ;`) : ``;
    }
    baseProjectRdfString += createdAt ? tier1RdfEntry(`dcterms:modified '${createdAt}' ;`) : ``;
    if(createdBy){
        baseProjectRdfString += createdBy.familyName ? tier1RdfEntry(`meta:createdBy-familyName '${escapeSpecialCharaters(createdBy.familyName)}' ;`) : ``;
        baseProjectRdfString += createdBy.givenName ? tier1RdfEntry(`meta:createdBy-givenName '${escapeSpecialCharaters(createdBy.givenName)}' ;`) : ``;
        baseProjectRdfString += createdBy.email.value ? tier1RdfEntry(`meta:createdBy-email '${escapeSpecialCharaters(createdBy.email.value)}' ;`) : ``;
        baseProjectRdfString += createdBy.org.organizationName ? tier1RdfEntry(`meta:createdBy-org-organizationName '${escapeSpecialCharaters(createdBy.org.organizationName)}' ;`) : ``;
    }
    baseProjectRdfString += ' .';
        
    return baseProjectRdfString;
}

transformDatatypes = (dataTypes) => {
    if (!isArrayWithContent(dataTypes)){
        return '';
    }
    
    let dataTypesRdfString = '';

    dataTypes.forEach( dataType => {
        let {id , title , type , revision , maxLength , fractionDigits , minInclusive , maxInclusive , changedAt} = dataType;
        dataTypeRdfString = emptyLine();

        dataTypeRdfString += id ? tier0RdfEntry(`this: meta:containsDataTypeMapping :${id} .`) : '';
        dataTypeRdfString += id ? tier0RdfEntry(`:${id} a meta:DataTypeMapping , owl:Class ;`) : '';
        dataTypeRdfString += id ? tier1RdfEntry(`meta:id '${escapeSpecialCharaters(id)}' ;`) : '';
        dataTypeRdfString += title ? tier1RdfEntry(`rdfs:label '${escapeSpecialCharaters(title)}' ;`) : '';
        dataTypeRdfString += type ? tier1RdfEntry(`meta:type '${escapeSpecialCharaters(type)}' ; `) : '';
        //dataTypeRdfString += type ? tier1RdfEntry(`meta:vocabularyElement '${escapeSpecialCharaters(type)}' ;`) : '';
        dataTypeRdfString += revision ? tier1RdfEntry(`meta:revision '${revision}' ;`) : '';
        dataTypeRdfString += maxLength ? tier1RdfEntry(`meta:maxLength '${maxLength}' ;`) : '';
        dataTypeRdfString += fractionDigits ? tier1RdfEntry(`meta:fractionDigits '${fractionDigits}' ;`) : '';
        dataTypeRdfString += minInclusive ? tier1RdfEntry(`meta:minInclusive '${minInclusive}' ;`) : '';
        dataTypeRdfString += maxInclusive ? tier1RdfEntry(`meta:maxInclusive '${maxInclusive}' ;`) : '';
        dataTypeRdfString += changedAt ? tier1RdfEntry(`dcterms:modified '${escapeSpecialCharaters(changedAt)}' ;`) : '';
        dataTypeRdfString += ' .';
        dataTypesRdfString += dataTypeRdfString;

        if(isArrayWithContent(dataType.values)){
            dataType.values.forEach( enumValue => {
                enumRdfString = emptyLine();
                
                enumRdfString += dataType.title && enumValue.id ? tier0RdfEntry(`:${escapeSpecialCharaters(enumValue.id)} a :${escapeSpecialCharaters(dataType.title)} ;`) : '';
                enumRdfString += enumValue.id ? tier1RdfEntry(`meta:id '${escapeSpecialCharaters(enumValue.id)}' ;`) : '';
                enumRdfString += enumValue.value ? tier1RdfEntry(`rdfs:label '${escapeSpecialCharaters(enumValue.value)}' ;`) : '';
                enumRdfString += ' .'
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
        let {id , title , dataType , revision , changedAt} = propertyClass;   
        propertyClassRdfString = emptyLine();
        
        propertyClassRdfString += id ? tier0RdfEntry(`this: meta:containsPropertyClassMapping :${id} .`) : '';
        propertyClassRdfString += id ? tier0RdfEntry(`:${id} a meta:PropertyClassMapping ;`) : '';
        propertyClassRdfString += id ? tier1RdfEntry(`meta:id '${escapeSpecialCharaters(id)}' ;`) : '';
        propertyClassRdfString += title ? tier1RdfEntry(`meta:title '${escapeSpecialCharaters(title)}' ; `) : '';
        //propertyClassRdfString += title ? tier1RdfEntry(`meta:vocabularyElement ${escapeSpecialCharaters(title)} ;`) : '';
        propertyClassRdfString += dataType ? tier1RdfEntry(`meta:dataType '${escapeSpecialCharaters(dataType)}' ;`) : '';
        propertyClassRdfString += revision ? tier1RdfEntry(`meta:revision '${escapeSpecialCharaters(revision)}' ;`) : '';
        propertyClassRdfString += changedAt ? tier1RdfEntry(`dcterms:modified '${escapeSpecialCharaters(changedAt)}' ;`) : '';
        propertyClassRdfString += ' .'
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
        let {id , title , description , icon , instantiation , changedAt , revision , propertyClasses} = resourceClass;
        resourceClassRdfString = emptyLine();

        resourceClassRdfString += id ? tier0RdfEntry(`this: meta:containsResourceClassMapping :${id} .`):'';
        resourceClassRdfString += id ? tier0RdfEntry(`:${id} a meta:ResourceClassMapping ;`):'';
        resourceClassRdfString += id ? tier1RdfEntry(`meta:id '${escapeSpecialCharaters(id)}' ;`):'';
        resourceClassRdfString += title ? tier1RdfEntry(`meta:title '${escapeSpecialCharaters(title)}';`):'';
        //resourceClassRdfString += title ? tier1RdfEntry(`meta:vocabularyElement '${escapeSpecialCharaters(title)}' ;`):'';
        resourceClassRdfString += description ? tier1RdfEntry(`meta:description '${escapeSpecialCharaters(description)}' ;`):'';
        resourceClassRdfString += icon ? tier1RdfEntry(`meta:icon '${escapeSpecialCharaters(icon)}' ;`):'';
        resourceClassRdfString += changedAt ? tier1RdfEntry(`dcterms:modified '${escapeSpecialCharaters(changedAt)}' ;`):'';
        resourceClassRdfString += revision ? tier1RdfEntry(`meta:revision '${escapeSpecialCharaters(revision)}' ;`):'';
        resourceClassRdfString += instantiation ? extractRdfFromSpecifObjectArray(`meta:instantiation`,instantiation) : '';
        resourceClassRdfString += propertyClasses ? extractRdfFromSpecifObjectArray(`meta:propertyClasses`,propertyClasses) : '';
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
        let {id , title , description , revision , changedAt , instantiation , subjectClasses , objectClasses} = statementClass;
        statementClassRDFString = emptyLine();
        
        statementClassRDFString += id ? tier0RdfEntry(`:${id} a meta:StatementClassMapping ;`) : '';
        statementClassRDFString += id ? tier0RdfEntry(`meta:id '${escapeSpecialCharaters(id)}' ;`) : '';
        statementClassRDFString += title ? tier1RdfEntry(`rdfs:label  '${escapeSpecialCharaters(title)}' ;`) : '';
        //statementClassRDFString += title ? tier1RdfEntry(`meta:vocabularyElement '${escapeSpecialCharaters(title)}' ;`) : '';
        statementClassRDFString += description ? tier1RdfEntry(`rdfs:comment '${escapeSpecialCharaters(description)}' ;`) : '';
        statementClassRDFString += revision ? tier1RdfEntry(`meta:revision: '${revision}' ;`) : '';
        statementClassRDFString += changedAt ? tier1RdfEntry(`dcterms:modified '${escapeSpecialCharaters(changedAt)}' ;`) : '';
        statementClassRDFString += instantiation ? extractRdfFromSpecifObjectArray(`meta:instantiation`,instantiation) : '';
        statementClassRDFString += subjectClasses ? extractRdfFromSpecifObjectArray(`meta:subjectClasses`,subjectClasses) : '';
        statementClassRDFString += objectClasses ? extractRdfFromSpecifObjectArray(`meta:objectClasses `,objectClasses) : '';
        statementClassRDFString += ' .'

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
        let {id , title , properties, class : resourceClass, revision , changedAt , changedBy} = resource;
        resourceRdfString = emptyLine();
        
        resourceRdfString += id ? tier0RdfEntry(`:${id} a IREB:Requirement ;`) : '';
        resourceRdfString += title ? tier1RdfEntry(`rdfs:label '${escapeSpecialCharaters(title)}' ;`) : '';
        resourceRdfString += id ? tier1RdfEntry(`meta:id '${escapeSpecialCharaters(id)}' ;`) : '';
        resourceRdfString += resourceClass ? tier1RdfEntry(`meta:PropertyClassMapping '${escapeSpecialCharaters(resourceClass)}' ;`) : '';
        if(isArrayWithContent(properties)){
            properties.forEach( property => {
                resourceRdfString += tier1RdfEntry(`:${property.class} '${escapeSpecialCharaters(property.value)}' ;`);
            })
        }
        resourceRdfString += revision ? tier1RdfEntry(`meta:revision '${revision}' ;`) : '';
        resourceRdfString += changedAt ? tier1RdfEntry(`dcterms:modified '${escapeSpecialCharaters(changedAt)}' ;`) : '';
        resourceRdfString += changedBy ? tier1RdfEntry(`meta:changedBy '${escapeSpecialCharaters(changedBy)}' ;`) : '';
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
        let {id , subject , class : statementClass , object , changedAt , changedBy , revision} = statement;
        statementRdfString = emptyLine();

        statementRdfString += id ? tier0RdfEntry(`:${id} a meta:Statement ;`) : '';
        statementRdfString += id ? tier1RdfEntry(`meta:id '${escapeSpecialCharaters(id)}' ;`) : '';
        statementRdfString += subject ? tier1RdfEntry(`rdf:subject :${subject} ;`) : '';
        statementRdfString += statementClass ? tier1RdfEntry(`rdf:predicate :${statementClass} ;`) : '';
        statementRdfString += object ? tier1RdfEntry(`rdf:object :${object} ;`) : '';
        statementRdfString += changedAt ? tier1RdfEntry(`meta:modified '${escapeSpecialCharaters(changedAt)}' ;`) : '';
        statementRdfString += changedBy ? tier1RdfEntry(`meta:changedBy '${escapeSpecialCharaters(changedBy)}' ;`) : '';
        statementRdfString += revision ? tier1RdfEntry(`meta:revision '${revision}' ;`) : '';
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
    let {id ,resource ,revision ,changedAt ,nodes} = hierarchyNode;
    let hierarchyNodeRdfString = emptyLine();

    hierarchyNodeRdfString += id ? tier0RdfEntry(`:${id} a SpecIF:RC-Hierarchy ;`) : '';
    hierarchyNodeRdfString += id ? tier1RdfEntry(`meta:id '${escapeSpecialCharaters(id)}' ;`) : '';
    hierarchyNodeRdfString += resource ? tier1RdfEntry(`meta:resource '${escapeSpecialCharaters(resource)}' ;`) : '';
    hierarchyNodeRdfString += revision ? tier1RdfEntry(`meta:revision '${revision}' ;`) : '';
    hierarchyNodeRdfString += changedAt ? tier1RdfEntry(`dcterms:modified '${escapeSpecialCharaters(changedAt)}' ;`) : '';
    
    if(isArrayWithContent(nodes)){
        NodeRdfString = tier1RdfEntry(`meta:nodes`);
        nodes.forEach( node => {
            NodeRdfString += tier2RdfEntry(`:${node.id} ,` );
        })
        hierarchyNodeRdfString += NodeRdfString.replace(/,([^,]*)$/, ';')
        hierarchyNodeRdfString += ` .`       

        nodes.forEach( node => {
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
        let {id , title , type , changedAt} = file;
        fileRdfString = emptyLine(); 
        fileRdfString += id ? tier0RdfEntry(`:${id} a meta:File ;`) : '';
        fileRdfString += id ? tier1RdfEntry(`meta:id '${id}' ;`) : '';
        fileRdfString += title ? tier1RdfEntry(`rdfs:label '${title}' ;`) : '';
        fileRdfString += type ? tier1RdfEntry(`meta:type '${type}' ;`) : '';
        fileRdfString += changedAt ? tier1RdfEntry(`dcterms:modified '${changedAt}' ;`) : '';
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
    element = document.getElementById('input');
    return element.value;
}

transform = () => {
    input = getInputValue();
    rdf = transformSpecifToRDF(input)
    element = document.getElementById('output');
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

escapeSpecialCharaters = (string) => {
    return string.replace(/\\([\s\S])|(')/g, "\\$1$2").replace(/\n/g, "\\n")
}