testTransformSpecifToTTL = (SpecIfObject) => {
   return transformSpecifToTTL("https://www.example.com",SpecIfObject)
}

transformSpecifToTTL = (baseUri, SpecIfObject) => {
    let ej= JSON.parse(SpecIfObject)
    let {id,dataTypes,propertyClasses,resourceClasses,statementClasses,resources,statements,hierarchies,files} = ej;
    let base = baseUri
    let projectID = id
    
    resultTtlString = defineTurtleVocabulary(base, projectID)
    resultTtlString += transformProjectBaseInformations(ej);    
    resultTtlString += transformDatatypes(dataTypes)
    resultTtlString += transformPropertyClasses(propertyClasses)    
    resultTtlString += transformResourceClasses(resourceClasses)    
    resultTtlString += transformStatementClasses(statementClasses);
    resultTtlString += transformResources(resources);
    resultTtlString += transformStatements(statements);
    resultTtlString += transformHierarchies(hierarchies);
    resultTtlString += transformFiles(files);
    return resultTtlString;
}

defineTurtleVocabulary = (baseUri, projectID) => {
    TtlString = tier0RdfEntry(`@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .`);
    TtlString += tier0RdfEntry(`@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .`);
    TtlString += tier0RdfEntry(`@prefix foaf: <http://xmlns.com/foaf/0.1/> .`);
    TtlString += tier0RdfEntry(`@prefix owl: <http://www.w3.org/2002/07/owl#> .`);
    TtlString += tier0RdfEntry(`#@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .`);
    TtlString += tier0RdfEntry(`@prefix xs: <http://www.w3.org/2001/XMLSchema#> .`);
    TtlString += tier0RdfEntry(`@prefix dcterms: <http://purl.org/dc/terms/> .`);
    TtlString += tier0RdfEntry(`@prefix vann: <http://purl.org/vocab/vann/> .`);
    TtlString += tier0RdfEntry(`@prefix foaf: <http://xmlns.com/foaf/0.1/> .`);
    TtlString += emptyLine()
    TtlString += tier0RdfEntry(`@prefix meta: <http://specif.de/v1.0/schema/meta#> .`);
    TtlString += tier0RdfEntry(`@prefix SpecIF: <http://specif.de/v1.0/schema/core#> .`);
    TtlString += tier0RdfEntry(`@prefix FMC: <http://specif.de/v1.0/schema/fmc#> .`);
    TtlString += tier0RdfEntry(`@prefix IREB: <http://specif.de/v1.0/schema/ireb#> .`);
    TtlString += tier0RdfEntry(`@prefix SysML: <http://specif.de/v1.0/schema/sysml#> .`);
    TtlString += tier0RdfEntry(`@prefix oslc: <http://specif.de/v1.0/schema/oslc#> .`);
    TtlString += tier0RdfEntry(`@prefix oslc_rm: <http://specif.de/v1.0/schema/oslc_rm#> .`);
    TtlString += tier0RdfEntry(`@prefix HIS: <http://specif.de/v1.0/schema/HIS#> .`);
    TtlString += tier0RdfEntry(`@prefix BPMN: <http://specif.de/v1.0/schema/bpmn#> .`);
    TtlString += emptyLine()
    TtlString += tier0RdfEntry(`@prefix : <${baseUri}/${projectID}/> .`);
    TtlString += tier0RdfEntry(`@prefix this: <${baseUri}/${projectID}/> .`);
    
    return TtlString;
}

transformProjectBaseInformations = (project) => {
    let { id ,  title , description , $schema , generator , generatorVersion , rights , createdAt , createdBy } = project;

    baseProjectTtlString = emptyLine();
    baseProjectTtlString += tier0RdfEntry(`this: a meta:Document ;`);
    baseProjectTtlString += id ? tier1RdfEntry(`meta:id '${escapeSpecialCharaters(id)}' ;`) : ``;
    baseProjectTtlString += title ? tier1RdfEntry(`rdfs:label '${escapeSpecialCharaters(title)}' ;`) : ``;
    baseProjectTtlString += description ? tier1RdfEntry(`rdfs:comment '${escapeSpecialCharaters(description)}' ;`) : ``;
    baseProjectTtlString += $schema ? tier1RdfEntry(`meta:schema <${$schema}> ;`) : ``;
    baseProjectTtlString += generator ? tier1RdfEntry(`meta:generator '${escapeSpecialCharaters(generator)}' ;`) : ``;
    baseProjectTtlString += generatorVersion ? tier1RdfEntry(`meta:generatorVersion '${escapeSpecialCharaters(generatorVersion)}' ;`) : ``;
    if(rights){
        baseProjectTtlString += rights.title ? tier1RdfEntry(`meta:rights-title '${escapeSpecialCharaters(rights.title)}' ;`) : ``;
        baseProjectTtlString += rights.type ? tier1RdfEntry(`meta:rights-type '${escapeSpecialCharaters(rights.type)}' ;`) : ``;
        baseProjectTtlString += rights.url ? tier1RdfEntry(`meta:rights-url '${escapeSpecialCharaters(rights.url)}' ;`) : ``;
    }
    baseProjectTtlString += createdAt ? tier1RdfEntry(`dcterms:modified '${createdAt}' ;`) : ``;
    if(createdBy){
        baseProjectTtlString += createdBy.familyName ? tier1RdfEntry(`meta:createdBy-familyName '${escapeSpecialCharaters(createdBy.familyName)}' ;`) : ``;
        baseProjectTtlString += createdBy.givenName ? tier1RdfEntry(`meta:createdBy-givenName '${escapeSpecialCharaters(createdBy.givenName)}' ;`) : ``;
        baseProjectTtlString += createdBy.email.value ? tier1RdfEntry(`meta:createdBy-email '${escapeSpecialCharaters(createdBy.email.value)}' ;`) : ``;
        baseProjectTtlString += createdBy.org.organizationName ? tier1RdfEntry(`meta:createdBy-org-organizationName '${escapeSpecialCharaters(createdBy.org.organizationName)}' ;`) : ``;
    }
    baseProjectTtlString += ' .';
        
    return baseProjectTtlString;
}

transformDatatypes = (dataTypes) => {
    if (!isArrayWithContent(dataTypes)){
        return '';
    }
    
    let dataTypesTtlString = '';

    dataTypes.forEach( dataType => {
        let {id , title , type , revision , maxLength , fractionDigits , minInclusive , maxInclusive , changedAt} = dataType;
        dataTypeTtlString = emptyLine();

        dataTypeTtlString += id ? tier0RdfEntry(`this: meta:containsDataTypeMapping :${id} .`) : '';
        dataTypeTtlString += id ? tier0RdfEntry(`:${id} a meta:DataTypeMapping , owl:Class ;`) : '';
        dataTypeTtlString += id ? tier1RdfEntry(`meta:id '${escapeSpecialCharaters(id)}' ;`) : '';
        dataTypeTtlString += title ? tier1RdfEntry(`rdfs:label '${escapeSpecialCharaters(title)}' ;`) : '';
        dataTypeTtlString += type ? tier1RdfEntry(`meta:type '${escapeSpecialCharaters(type)}' ; `) : '';
        //dataTypeTtlString += type ? tier1RdfEntry(`meta:vocabularyElement '${escapeSpecialCharaters(type)}' ;`) : '';
        dataTypeTtlString += revision ? tier1RdfEntry(`meta:revision '${revision}' ;`) : '';
        dataTypeTtlString += maxLength ? tier1RdfEntry(`meta:maxLength '${maxLength}' ;`) : '';
        dataTypeTtlString += fractionDigits ? tier1RdfEntry(`meta:fractionDigits '${fractionDigits}' ;`) : '';
        dataTypeTtlString += minInclusive ? tier1RdfEntry(`meta:minInclusive '${minInclusive}' ;`) : '';
        dataTypeTtlString += maxInclusive ? tier1RdfEntry(`meta:maxInclusive '${maxInclusive}' ;`) : '';
        dataTypeTtlString += changedAt ? tier1RdfEntry(`dcterms:modified '${escapeSpecialCharaters(changedAt)}' ;`) : '';
        dataTypeTtlString += ' .';
        dataTypesTtlString += dataTypeTtlString;

        if(isArrayWithContent(dataType.values)){
            dataType.values.forEach( enumValue => {
                enumTtlString = emptyLine();
                
                enumTtlString += dataType.title && enumValue.id ? tier0RdfEntry(`:${escapeSpecialCharaters(enumValue.id)} a :${escapeSpecialCharaters(dataType.title)} ;`) : '';
                enumTtlString += enumValue.id ? tier1RdfEntry(`meta:id '${escapeSpecialCharaters(enumValue.id)}' ;`) : '';
                enumTtlString += enumValue.value ? tier1RdfEntry(`rdfs:label '${escapeSpecialCharaters(enumValue.value)}' ;`) : '';
                enumTtlString += ' .'
                dataTypesTtlString += enumTtlString;
            })
        }
    })

    return dataTypesTtlString;
}
 
transformPropertyClasses = (propertyClasses) => {
    if (!isArrayWithContent(propertyClasses)){
        return '';
    }
    let propertyClassesTtlString = '';
    
    propertyClasses.forEach(propertyClass => {     
        let {id , title , dataType , revision , changedAt} = propertyClass;   
        propertyClassTtlString = emptyLine();
        
        propertyClassTtlString += id ? tier0RdfEntry(`this: meta:containsPropertyClassMapping :${id} .`) : '';
        propertyClassTtlString += id ? tier0RdfEntry(`:${id} a meta:PropertyClassMapping ;`) : '';
        propertyClassTtlString += id ? tier1RdfEntry(`meta:id '${escapeSpecialCharaters(id)}' ;`) : '';
        propertyClassTtlString += title ? tier1RdfEntry(`meta:title '${escapeSpecialCharaters(title)}' ; `) : '';
        //propertyClassTtlString += title ? tier1RdfEntry(`meta:vocabularyElement ${escapeSpecialCharaters(title)} ;`) : '';
        propertyClassTtlString += dataType ? tier1RdfEntry(`meta:dataType '${escapeSpecialCharaters(dataType)}' ;`) : '';
        propertyClassTtlString += revision ? tier1RdfEntry(`meta:revision '${escapeSpecialCharaters(revision)}' ;`) : '';
        propertyClassTtlString += changedAt ? tier1RdfEntry(`dcterms:modified '${escapeSpecialCharaters(changedAt)}' ;`) : '';
        propertyClassTtlString += ' .'
        propertyClassesTtlString += propertyClassTtlString
    })
    return propertyClassesTtlString;
}

transformResourceClasses = (resourceClasses) => {
    if (!isArrayWithContent(resourceClasses)){
        return '';
    }

    let resourceClassesTtlString=``;

    resourceClasses.forEach( resourceClass => {
        let {id , title , description , icon , instantiation , changedAt , revision , propertyClasses} = resourceClass;
        resourceClassTtlString = emptyLine();

        resourceClassTtlString += id ? tier0RdfEntry(`this: meta:containsResourceClassMapping :${id} .`):'';
        resourceClassTtlString += id ? tier0RdfEntry(`:${id} a meta:ResourceClassMapping ;`):'';
        resourceClassTtlString += id ? tier1RdfEntry(`meta:id '${escapeSpecialCharaters(id)}' ;`):'';
        resourceClassTtlString += title ? tier1RdfEntry(`meta:title '${escapeSpecialCharaters(title)}';`):'';
        //resourceClassTtlString += title ? tier1RdfEntry(`meta:vocabularyElement '${escapeSpecialCharaters(title)}' ;`):'';
        resourceClassTtlString += description ? tier1RdfEntry(`meta:description '${escapeSpecialCharaters(description)}' ;`):'';
        resourceClassTtlString += icon ? tier1RdfEntry(`meta:icon '${escapeSpecialCharaters(icon)}' ;`):'';
        resourceClassTtlString += changedAt ? tier1RdfEntry(`dcterms:modified '${escapeSpecialCharaters(changedAt)}' ;`):'';
        resourceClassTtlString += revision ? tier1RdfEntry(`meta:revision '${escapeSpecialCharaters(revision)}' ;`):'';
        resourceClassTtlString += instantiation ? extractRdfFromSpecifObjectArray(`meta:instantiation`,instantiation) : '';
        resourceClassTtlString += propertyClasses ? extractRdfFromSpecifObjectArray(`meta:propertyClasses`,propertyClasses) : '';
        resourceClassTtlString+= ' .'

        resourceClassesTtlString+=resourceClassTtlString
    })

    return resourceClassesTtlString;
}

transformStatementClasses = (statementClasses) => {
    if (!isArrayWithContent(statementClasses)){
        return '';
    }

    let statementClassesTtlString = ``;

    statementClasses.forEach( statementClass => {
        let {id , title , description , revision , changedAt , instantiation , subjectClasses , objectClasses} = statementClass;
        statementClassTtlString = emptyLine();
        
        statementClassTtlString += id ? tier0RdfEntry(`:${id} a meta:StatementClassMapping ;`) : '';
        statementClassTtlString += id ? tier0RdfEntry(`meta:id '${escapeSpecialCharaters(id)}' ;`) : '';
        statementClassTtlString += title ? tier1RdfEntry(`rdfs:label  '${escapeSpecialCharaters(title)}' ;`) : '';
        //statementClassTtlString += title ? tier1RdfEntry(`meta:vocabularyElement '${escapeSpecialCharaters(title)}' ;`) : '';
        statementClassTtlString += description ? tier1RdfEntry(`rdfs:comment '${escapeSpecialCharaters(description)}' ;`) : '';
        statementClassTtlString += revision ? tier1RdfEntry(`meta:revision: '${revision}' ;`) : '';
        statementClassTtlString += changedAt ? tier1RdfEntry(`dcterms:modified '${escapeSpecialCharaters(changedAt)}' ;`) : '';
        statementClassTtlString += instantiation ? extractRdfFromSpecifObjectArray(`meta:instantiation`,instantiation) : '';
        statementClassTtlString += subjectClasses ? extractRdfFromSpecifObjectArray(`meta:subjectClasses`,subjectClasses) : '';
        statementClassTtlString += objectClasses ? extractRdfFromSpecifObjectArray(`meta:objectClasses `,objectClasses) : '';
        statementClassTtlString += ' .'

        statementClassesTtlString += statementClassTtlString;
        })
    
    return statementClassesTtlString;
    
}

transformResources = (resources) => {
    if (!isArrayWithContent(resources)){
        return '';
    }

    let resourcesTtlString = ''
    resources.forEach( resource => {
        let {id , title , properties, class : resourceClass, revision , changedAt , changedBy} = resource;
        resourceTtlString = emptyLine();
        
        resourceTtlString += id ? tier0RdfEntry(`:${id} a IREB:Requirement ;`) : '';
        resourceTtlString += title ? tier1RdfEntry(`rdfs:label '${escapeSpecialCharaters(title)}' ;`) : '';
        resourceTtlString += id ? tier1RdfEntry(`meta:id '${escapeSpecialCharaters(id)}' ;`) : '';
        resourceTtlString += resourceClass ? tier1RdfEntry(`meta:PropertyClassMapping '${escapeSpecialCharaters(resourceClass)}' ;`) : '';
        if(isArrayWithContent(properties)){
            properties.forEach( property => {
                resourceTtlString += tier1RdfEntry(`:${property.class} '${escapeSpecialCharaters(property.value)}' ;`);
            })
        }
        resourceTtlString += revision ? tier1RdfEntry(`meta:revision '${revision}' ;`) : '';
        resourceTtlString += changedAt ? tier1RdfEntry(`dcterms:modified '${escapeSpecialCharaters(changedAt)}' ;`) : '';
        resourceTtlString += changedBy ? tier1RdfEntry(`meta:changedBy '${escapeSpecialCharaters(changedBy)}' ;`) : '';
        resourceTtlString += ' .'

        resourcesTtlString += resourceTtlString;
    })

    return resourcesTtlString;
}

transformStatements = (statements) => {
    if (!isArrayWithContent(statements)){
        return '';
    }

    let statementsTtlString = ``
    
    statements.forEach( statement => {
        let {id , subject , class : statementClass , object , changedAt , changedBy , revision} = statement;
        statementTtlString = emptyLine();

        statementTtlString += id ? tier0RdfEntry(`:${id} a meta:Statement ;`) : '';
        statementTtlString += id ? tier1RdfEntry(`meta:id '${escapeSpecialCharaters(id)}' ;`) : '';
        statementTtlString += subject ? tier1RdfEntry(`rdf:subject :${subject} ;`) : '';
        statementTtlString += statementClass ? tier1RdfEntry(`rdf:predicate :${statementClass} ;`) : '';
        statementTtlString += object ? tier1RdfEntry(`rdf:object :${object} ;`) : '';
        statementTtlString += changedAt ? tier1RdfEntry(`meta:modified '${escapeSpecialCharaters(changedAt)}' ;`) : '';
        statementTtlString += changedBy ? tier1RdfEntry(`meta:changedBy '${escapeSpecialCharaters(changedBy)}' ;`) : '';
        statementTtlString += revision ? tier1RdfEntry(`meta:revision '${revision}' ;`) : '';
        statementTtlString += ' .'

        statementsTtlString += statementTtlString;
    })

    return statementsTtlString;
}

transformHierarchies = (hierarchies) => {
    if (!isArrayWithContent(hierarchies)){
        return '';
    }

    let hierarchyTtlString = ''

    hierarchies.forEach( node => {
        hierarchyTtlString+=transformNodes(node)
    })

    return hierarchyTtlString
}

transformNodes = (hierarchyNode) => {
    let {id ,resource ,revision ,changedAt ,nodes} = hierarchyNode;
    let hierarchyNodeTtlString = emptyLine();

    hierarchyNodeTtlString += id ? tier0RdfEntry(`:${id} a SpecIF:RC-Hierarchy ;`) : '';
    hierarchyNodeTtlString += id ? tier1RdfEntry(`meta:id '${escapeSpecialCharaters(id)}' ;`) : '';
    hierarchyNodeTtlString += resource ? tier1RdfEntry(`meta:resource '${escapeSpecialCharaters(resource)}' ;`) : '';
    hierarchyNodeTtlString += revision ? tier1RdfEntry(`meta:revision '${revision}' ;`) : '';
    hierarchyNodeTtlString += changedAt ? tier1RdfEntry(`dcterms:modified '${escapeSpecialCharaters(changedAt)}' ;`) : '';
    
    if(isArrayWithContent(nodes)){
        NodeTtlString = tier1RdfEntry(`meta:nodes`);
        nodes.forEach( node => {
            NodeTtlString += tier2RdfEntry(`:${node.id} ,` );
        })
        hierarchyNodeTtlString += NodeTtlString.replace(/,([^,]*)$/, ';')
        hierarchyNodeTtlString += ` .`       

        nodes.forEach( node => {
            hierarchyNodeTtlString += transformNodes(node); 
        })
        return hierarchyNodeTtlString
    } else {
        hierarchyNodeTtlString += ` .`
        return hierarchyNodeTtlString
    }
    
}

transformFiles = (files) => {
    if (!isArrayWithContent(files)){
        return '';
    }

    let filesTtlString = ``;
    files.forEach( file => {
        let {id , title , type , changedAt} = file;
        fileTtlString = emptyLine(); 
        fileTtlString += id ? tier0RdfEntry(`:${id} a meta:File ;`) : '';
        fileTtlString += id ? tier1RdfEntry(`meta:id '${id}' ;`) : '';
        fileTtlString += title ? tier1RdfEntry(`rdfs:label '${title}' ;`) : '';
        fileTtlString += type ? tier1RdfEntry(`meta:type '${type}' ;`) : '';
        fileTtlString += changedAt ? tier1RdfEntry(`dcterms:modified '${changedAt}' ;`) : '';
        fileTtlString += ' .'
        filesTtlString += fileTtlString;
    })

    return filesTtlString;
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
    let TtlString = '';
    if(isArrayWithContent(objectArray)){
        TtlString = tier1RdfEntry(predicate);
        objectArray.forEach( object => {
            TtlString += tier2RdfEntry(`:${object} ,`);
        })
        TtlString=TtlString.replace(/,([^,]*)$/, ';');
    }
    return TtlString
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
    return string.replace("\\","\\\\").replace(/\\([\s\S])|(')/g, "\\$1$2").replace(/\n/g, "\\n")
}