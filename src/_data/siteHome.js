const groq = require('groq')
const client = require('../utils/sanityClient')
module.exports =  async function() {
  const sanityResponse = await client.fetch(groq`
    *[_id == "siteHome"]{
      ...,
      content {
        hero,
        sections[]{
          ...,
          _type == 'reusedSection' => {
            ...,
            reusableSection->{
              ...
            }
          }
        }
      }
      
    }[0]
  `).catch(err => console.error(err))

  return sanityResponse
}

// should return (example):
const siteHome = {
  "_createdAt": "2020-12-08T08:07:12Z",
  "_id": "siteHome",
  "_rev": "YFV9fGATAGZ4qSVlmTc0Ru",
  "_type": "siteHome",
  "_updatedAt": "2020-12-08T08:27:27Z",
  "content": {
    "_type": "object",
    "sections": [
      {
        "_key": "a3e4d716a7db",
        "_type": "magSection",
        "button1": {
          "_type": "button",
          "text": "Buy Waterpark Pass Online & Save",
          "url": "#"
        },
        "image": {
          "_type": "bgImage",
          "alt": "people enjoying a sunny day at the Laguna Splash Water Park",
          "asset": {
            "_ref": "image-07f29dad6b7619710bc4e12cc969d59f4a687e86-4272x2848-jpg",
            "_type": "reference"
          }
        },
        "subtitle": "We've added so much more to our water park for families to enjoy! ",
        "text": [
          {
            "_key": "e7ea7ab67bf0",
            "_type": "block",
            "children": [
              {
                "_key": "566048a0f63a",
                "_type": "span",
                "marks": [],
                "text": "Free Parking"
              }
            ],
            "level": 1,
            "listItem": "bullet",
            "markDefs": [],
            "style": "normal"
          },
          {
            "_key": "1ff30e78a6d7",
            "_type": "block",
            "children": [
              {
                "_key": "957158887cab",
                "_type": "span",
                "marks": [],
                "text": "Free Admission into Ride Park"
              }
            ],
            "level": 1,
            "listItem": "bullet",
            "markDefs": [],
            "style": "normal"
          },
          {
            "_key": "3039dcd78609",
            "_type": "block",
            "children": [
              {
                "_key": "5a678c5a6355",
                "_type": "span",
                "marks": [],
                "text": "All-Day Fun Passes and Individual Ride Tickets are available. We can't wait to see you!"
              }
            ],
            "markDefs": [],
            "style": "normal"
          }
        ],
        "title": "Check Out Our Expanded Water Park"
      },
      {
        "_key": "664b41c7b1d6",
        "_type": "ctaSection",
        "button1": {
          "_type": "button",
          "text": "Buy Season Pass Online",
          "url": "#"
        },
        "image": {
          "_type": "bgImage",
          "alt": "people buying pizza from Pappy Fred's pizzeria",
          "asset": {
            "_ref": "image-fd2d10eb828cc38443e87f3ca1b8e9761aa40efe-4272x2848-jpg",
            "_type": "reference"
          }
        },
        "title": "2021 season passes are on sale now"
      }
    ]
  }
}