const groq = require('groq')
const client = require('../utils/sanityClient')
module.exports =  async function() {
  return await client.fetch(groq`
    *[_id == "siteSettings"]{
      ...
    }[0]
  `)
}


// should return (example):
const siteSettings = {
  "_createdAt": "2020-11-11T10:45:26Z",
  "_id": "siteSettings",
  "_rev": "VTYlJ1TfNgz1SXMDr02MQH",
  "_type": "siteSettings",
  "_updatedAt": "2020-11-11T13:29:08Z",
  "content": {
    "_type": "object",
    "alertActive": false,
    "alertIsActive": true,
    "alertMessage": [
      {
        "_key": "43d2bbf85c9f",
        "_type": "block",
        "children": [
          {
            "_key": "b0bd8c235db6",
            "_type": "span",
            "marks": [],
            "text": "The park will be closed tomorrow, July 13th, due to inclement weather."
          }
        ],
        "markDefs": [],
        "style": "normal"
      }
    ]
  }
}