const structRegex = /type(?:\s*)(\w+)(?:\s*)struct(?:\s*)\{([\s\S]*)\}/mg
const attributeRegex = /(\w+)(?:\s*)(\w+)(?:.*)$/mg

function getStructInformation(declaration) {
	let structName = '', structContentRaw = '', structContent = []
	declaration.replace(structRegex, (_, name, attributes) => {
		structName = name
		structContentRaw = attributes
	})
	structContentRaw.match(attributeRegex).forEach(attribute => {
		attribute.replace(attributeRegex, (_, attributeName, attributeType) => {
			structContent.push({
				name: attributeName,
				type: attributeType
			})
		})
	})
	return {
		name: structName,
		attributes: structContent
	}
}

function createGetters(declaration) {
	// Creates the getters for a structure.
	let info = getStructInformation(declaration)
	gettersStr = ''
	firstLetter = info.name[0].toLowercase()
	info.attributes.forEach(attribute => {
		gettersStr += `func (${firstLetter} ${info.name}) ${attribute.type} {\n\treturn ${firstLetter}.${attribute.name}\n}\n\n`
	})
	return gettersStr
}

module.exports = createGetters
