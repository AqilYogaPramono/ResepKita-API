const parseJsonFields = (fields) => (req, res, next) => {
    fields.forEach(field => {
        if (req.body && req.body[field] !== undefined) {
            let val = req.body[field]
            if (typeof val === 'string') {
                try {
                    val = JSON.parse(val)
                } catch { }
            }
            if (!Array.isArray(val)) {
                val = val ? [val] : []
            }
            req.body[field] = val
        } else if (req.body) {
            req.body[field] = []
        }
    })
    next()
}

module.exports = { parseJsonFields }
