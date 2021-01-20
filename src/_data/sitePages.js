const groq = require('groq')
const client = require('../utils/sanityClient')
const overlayDrafts = require('../utils/overlayDrafts')
const hasToken = !!client.config().token


// function processResponse(sanityResponse) {

  
//   // iterate through all pages
//   const processedResponse = sanityResponse.map((page) => {
//     // grab the body field of the page
//     const {content} = page
//     const {body} = content
    
//     // create an object containing all the heading blocks by:
//     // 1. iterating through all the blocks in the body field of the page
//     const headings = body.map((block, i) => {
//       // if the block's type is "bigHeading"
//       if (block._type === 'bigHeading') {
//         return block
//       }
//     })

//     return true
//   })

//   return processedResponse
// }


module.exports =  async function() {
  const sanityResponse = await client.fetch(groq`
  *[_type == "page"]{
    ...,
    content {
      ...,
      sections[] {
        ...,
        reusableSection->{
          ...
        }
      }
    }
  }
  `).catch(err => console.error(err))

  // processedResponse = processResponse(sanityResponse)

  const reducedDocs = overlayDrafts(hasToken, sanityResponse)

  return reducedDocs
}

// should return (example):
const sitePages = [
  {
    "_createdAt": "2020-11-19T16:27:13Z",
    "_id": "2283d8f7-30c9-4f94-97b0-6f5d2760e2ad",
    "_rev": "Amh7I9wNocnFbKoJIe1URP",
    "_type": "page",
    "_updatedAt": "2020-11-21T08:24:38Z",
    "content": {
      "_type": "object",
      "body": [
        {
          "_key": "58583988cbf4",
          "_type": "block",
          "children": [
            {
              "_key": "307e19d8d90e",
              "_type": "span",
              "marks": [
                "strong"
              ],
              "text": "2020 All-Day Fun Pass Group Pricing"
            }
          ],
          "markDefs": [],
          "style": "h2"
        },
        {
          "_key": "b1b2a7338e1e",
          "_type": "block",
          "children": [
            {
              "_key": "70be268d4558",
              "_type": "span",
              "marks": [],
              "text": "(Includes Laguna Splash Water Park In Season)"
            }
          ],
          "markDefs": [],
          "style": "h3"
        },
        {
          "_key": "d39a4d45430f",
          "_type": "block",
          "children": [
            {
              "_key": "ddf8d088f8db0",
              "_type": "span",
              "marks": [],
              "text": "Groups must purchase at least "
            },
            {
              "_key": "ddf8d088f8db1",
              "_type": "span",
              "marks": [
                "strong"
              ],
              "text": "20 All-Day Fun Passes"
            },
            {
              "_key": "ddf8d088f8db2",
              "_type": "span",
              "marks": [],
              "text": " to Qualify for Group Rate. Catered Groups Automatically Qualify for Group Pricing. Group Rate is not valid with any other offer."
            }
          ],
          "markDefs": [],
          "style": "normal"
        },
        {
          "_key": "5264dee3b90b",
          "_type": "block",
          "children": [
            {
              "_key": "91f7f93015d00",
              "_type": "span",
              "marks": [
                "strong"
              ],
              "text": "May & September:"
            }
          ],
          "markDefs": [],
          "style": "h3"
        },
        {
          "_key": "9d6f04c216c0",
          "_type": "block",
          "children": [
            {
              "_key": "8c6ff40376b0",
              "_type": "span",
              "marks": [
                "strong"
              ],
              "text": "Group Rate:"
            },
            {
              "_key": "91f7f93015d03",
              "_type": "span",
              "marks": [],
              "text": " $16.95 each (includes Water Park in season)"
            }
          ],
          "level": 1,
          "listItem": "bullet",
          "markDefs": [],
          "style": "normal"
        },
        {
          "_key": "e97c0473fb2e",
          "_type": "block",
          "children": [
            {
              "_key": "fccbd345a216",
              "_type": "span",
              "marks": [],
              "text": "Regular Price: $21.95 each"
            }
          ],
          "level": 1,
          "listItem": "bullet",
          "markDefs": [],
          "style": "normal"
        },
        {
          "_key": "7170bea39007",
          "_type": "block",
          "children": [
            {
              "_key": "91f7f93015d04",
              "_type": "span",
              "marks": [
                "strong"
              ],
              "text": "June, July, & August:"
            }
          ],
          "markDefs": [],
          "style": "h3"
        },
        {
          "_key": "dc968fb8d8c8",
          "_type": "block",
          "children": [
            {
              "_key": "943759a9022e",
              "_type": "span",
              "marks": [
                "strong"
              ],
              "text": "Group Rate:"
            },
            {
              "_key": "91f7f93015d07",
              "_type": "span",
              "marks": [],
              "text": " $21.95 each"
            }
          ],
          "level": 1,
          "listItem": "bullet",
          "markDefs": [],
          "style": "normal"
        },
        {
          "_key": "7817ceb60a3c",
          "_type": "block",
          "children": [
            {
              "_key": "21b24f60c8f8",
              "_type": "span",
              "marks": [],
              "text": "Regular Price: $31.95 each"
            }
          ],
          "level": 1,
          "listItem": "bullet",
          "markDefs": [],
          "style": "normal"
        },
        {
          "_key": "b7a2b73d0fc6",
          "_type": "block",
          "children": [
            {
              "_key": "50eadf1efc590",
              "_type": "span",
              "marks": [
                "strong"
              ],
              "text": "Please Note: "
            },
            {
              "_key": "cd544bfdd571",
              "_type": "span",
              "marks": [],
              "text": "All Guests must have paid admission wristband to enter Water Park."
            }
          ],
          "markDefs": [],
          "style": "normal"
        },
        {
          "_key": "a078f5a7c0ff",
          "_type": "mainImage",
          "alt": "school picnic group posing for group photo at DelGrosso's Amusement Park",
          "asset": {
            "_ref": "image-987f9cb6f82e5c7decc14139938c5d30e7385bb6-1200x900-jpg",
            "_type": "reference"
          },
          "crop": {
            "_type": "sanity.imageCrop",
            "bottom": 0,
            "left": 0,
            "right": 0,
            "top": 0
          },
          "hotspot": {
            "_type": "sanity.imageHotspot",
            "height": 0.22721088435374157,
            "width": 0.22857142857142893,
            "x": 0.45306122448979547,
            "y": 0.5108843537414974
          }
        },
        {
          "_key": "a8a8151ac4d6",
          "_type": "block",
          "children": [
            {
              "_key": "b0bc669bea480",
              "_type": "span",
              "marks": [],
              "text": "Infant Admission Policy"
            }
          ],
          "markDefs": [],
          "style": "h3"
        },
        {
          "_key": "953f61c9f5ee",
          "_type": "block",
          "children": [
            {
              "_key": "448220f585e7",
              "_type": "span",
              "marks": [],
              "text": "Children Under 24 Months of age are admitted to Water Park, and can ride only the Adult Carousels and Train free - when accompanied by an adult with proper admission."
            }
          ],
          "markDefs": [],
          "style": "normal"
        },
        {
          "_key": "20ddee1db120",
          "_type": "cta",
          "button1": {
            "_type": "button",
            "text": "Email",
            "url": "mailto:picnics@delgrossos.com"
          },
          "button2": {
            "_type": "button",
            "text": "Call",
            "url": "tel:8146843538"
          },
          "image": {
            "_type": "mainImage",
            "alt": "school picnic group posing for group photo at DelGrosso's Amusement Park",
            "asset": {
              "_ref": "image-987f9cb6f82e5c7decc14139938c5d30e7385bb6-1200x900-jpg",
              "_type": "reference"
            }
          },
          "subtitle": "Contact our Group Sales Office",
          "text": [
            {
              "_key": "9d8bcb2b75bb",
              "_type": "block",
              "children": [
                {
                  "_key": "24c1e9bd6538",
                  "_type": "span",
                  "marks": [],
                  "text": "Email "
                },
                {
                  "_key": "9bf6831c76bc",
                  "_type": "span",
                  "marks": [
                    "strong",
                    "c22b9c4d9c49"
                  ],
                  "text": "picnics@delgrossos.com"
                },
                {
                  "_key": "f3d429ff290d",
                  "_type": "span",
                  "marks": [],
                  "text": " or call "
                },
                {
                  "_key": "53abeca717d2",
                  "_type": "span",
                  "marks": [
                    "e5311f70b36e"
                  ],
                  "text": "814-684-3538"
                },
                {
                  "_key": "6e12e267b64e",
                  "_type": "span",
                  "marks": [],
                  "text": " (Toll-free "
                },
                {
                  "_key": "0372032c8080",
                  "_type": "span",
                  "marks": [
                    "9a786045cc51"
                  ],
                  "text": "866-684-3538"
                },
                {
                  "_key": "cbcf077f17da",
                  "_type": "span",
                  "marks": [],
                  "text": ") ext. 309."
                }
              ],
              "markDefs": [
                {
                  "_key": "c22b9c4d9c49",
                  "_type": "link",
                  "href": "mailto:picnics@delgrossos.com"
                },
                {
                  "_key": "e5311f70b36e",
                  "_type": "link",
                  "href": "tel:8146843538"
                },
                {
                  "_key": "9a786045cc51",
                  "_type": "link",
                  "href": "tel:8666843538"
                }
              ],
              "style": "normal"
            }
          ],
          "title": "Schedule a Group Visit Today"
        },
        {
          "_key": "7e015ead0d5d",
          "_type": "block",
          "children": [
            {
              "_key": "00278576cf41",
              "_type": "span",
              "marks": [],
              "text": ""
            }
          ],
          "markDefs": [],
          "style": "normal"
        }
      ],
      "mainImage": {
        "_type": "image",
        "asset": {
          "_ref": "image-987f9cb6f82e5c7decc14139938c5d30e7385bb6-1200x900-jpg",
          "_type": "reference"
        }
      },
      "slug": {
        "_type": "slug",
        "current": "groups-pricing"
      },
      "status": {
        "_type": "pageStatus",
        "contentImages": "empty",
        "copy": "to approve"
      },
      "title": "Group Pricing"
    }
  },
  {
    "_createdAt": "2020-11-18T11:57:10Z",
    "_id": "b4a65428-a149-496f-9012-933d81468d74",
    "_rev": "45JAooC9lno2tw6ALDDSP6",
    "_type": "page",
    "_updatedAt": "2020-11-18T13:06:34Z",
    "content": {
      "_type": "object",
      "body": [
        {
          "_key": "ec16947817bc",
          "_type": "block",
          "children": [
            {
              "_key": "89b44a9e036a",
              "_type": "span",
              "marks": [],
              "text": "Do you need a place to host your "
            },
            {
              "_key": "e79a9d628b5e",
              "_type": "span",
              "marks": [
                "strong"
              ],
              "text": "company picnic"
            },
            {
              "_key": "f36a247ae5bd",
              "_type": "span",
              "marks": [],
              "text": ", "
            },
            {
              "_key": "3f2de41361c4",
              "_type": "span",
              "marks": [
                "strong"
              ],
              "text": "family reunion,"
            },
            {
              "_key": "9e89826807f5",
              "_type": "span",
              "marks": [],
              "text": " or "
            },
            {
              "_key": "4a1ead1376e7",
              "_type": "span",
              "marks": [
                "strong"
              ],
              "text": "birthday party"
            },
            {
              "_key": "eab203f0b4e2",
              "_type": "span",
              "marks": [],
              "text": "?"
            }
          ],
          "markDefs": [],
          "style": "h2"
        },
        {
          "_key": "60a4b1ed8255",
          "_type": "block",
          "children": [
            {
              "_key": "9f9f3552d7d7",
              "_type": "span",
              "marks": [],
              "text": "DelGrosso's Amusement Park can help you with every step of the process. The Park Picnic Grounds has pavilions available for all-day rental, and you can even have your get-together catered by our excellent catering staff! "
            }
          ],
          "markDefs": [],
          "style": "normal"
        },
        {
          "_key": "d4ba1052744f",
          "_type": "block",
          "children": [
            {
              "_key": "0687806e2f3a",
              "_type": "span",
              "marks": [],
              "text": "If you need help fitting a picnic day into your budget, give us a call we can work with you to create a fun filled day at the park!"
            }
          ],
          "markDefs": [],
          "style": "normal"
        },
        {
          "_key": "b8a56340a5c7",
          "_type": "block",
          "children": [
            {
              "_key": "d6a8b085d507",
              "_type": "span",
              "marks": [
                "880ee3d7b59c"
              ],
              "text": "Click Here to visit our Group Picnic Planner for details"
            },
            {
              "_key": "b95c98d2f2e4",
              "_type": "span",
              "marks": [],
              "text": " or Contact our Group Coordinator by sending an email to "
            },
            {
              "_key": "064c365c9b43",
              "_type": "span",
              "marks": [
                "strong",
                "cfc0712e4f14"
              ],
              "text": "picnics@delgrossos.com"
            },
            {
              "_key": "9c4d0461f224",
              "_type": "span",
              "marks": [],
              "text": " or by calling our Group Sales Office at "
            },
            {
              "_key": "81e42651510a",
              "_type": "span",
              "marks": [
                "strong"
              ],
              "text": "814-684-3538 "
            },
            {
              "_key": "ae65bc72afeb",
              "_type": "span",
              "marks": [],
              "text": "(ext. 309)"
            }
          ],
          "markDefs": [
            {
              "_key": "880ee3d7b59c",
              "_type": "link",
              "href": "https://www.mydelgrossopark.com/site/assets/files/1032/low_res_dap_2020_group_picnic_planner_web-1.pdf"
            },
            {
              "_key": "cfc0712e4f14",
              "_type": "link",
              "href": "mailto:picnics@delgrossos.com"
            }
          ],
          "style": "normal"
        }
      ],
      "slug": {
        "_type": "slug",
        "current": "group-picnics"
      },
      "status": {
        "_type": "pageStatus",
        "copy": "to update",
        "headerImage": "empty"
      },
      "title": "Group Picnics"
    }
  },
]