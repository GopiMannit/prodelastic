const axios = require('axios');
require('dotenv').config();
const { Client } = require('@elastic/elasticsearch');
const client = new Client({
  node: process.env.ELASTIC_SERVER_URL,
  auth: {
    username: process.env.ELASTIC_USERNAME,
    password: process.env.ELASTIC_PASSWORD
  },
  ssl: {
    rejectUnauthorized: false
  }
});
const createIndex = async (req, res) => {
  try {
    const indexExists = await client.indices.exists({
      index: `${req.query.domain}`
    });
    console.log(indexExists.body);
    if (indexExists.body == false) {
      const domain = req.query.domain;
      const document = {
        d_count: 0,
        c_count: 0,
        u_count: 0,
        s_count: 0
      }
      await client.indices.create({
        index: domain 
      });
      await client.index({
        index: domain,
        id: 'count',
        body: document
      });
      res.status(200).json({
         message: process.env.SERVER_UR + "/" + domain });
    }
    else {
      res.status(409).json({ 
        message: 'Domain Already Exists' 
      });
    }
  } catch (error) {
    //console.error('Error:', error);
    res.status(500).json(
      {
          message:'Internal Server Error'
      }
    );
  }
}
const getDomain = async (req, res) => {
  try {
    const { body } = await client.cat.indices({ format: 'json' });
    const indices = body
      .filter((index) => !index.index.startsWith('.'))
      .map((index) => index.index);

    res.status(202).json({
      message:"Domain retrieved successfully",
      object:indices

    });
  } catch (error) {
    //console.error('Error retrieving indices:', error);
    res.status(500).json({ 
      
      message: 'Internal Server Error',

     });
  }
}
const getText = async (req, res) => {
  try {
    const indexExists = await client.indices.exists({
      index: `${req.query.domain}`
    });
    console.log(indexExists.body);
    if (indexExists.body == true) {
      const { body } = await client.search({
        index: req.query.domain,
        body: {
          query: {
            query_string: {
              fields: ['*'],
              query: `*${req.query.searchstring}*`,
            },
          },
          highlight: {
            fields: {
              "*": {}
            }
          }
        },
      });
      const hits = body.hits.hits;
      console.log(hits);
      if (hits.length > 0) {
        const arr = hits.map(hit => {
          const fields = Object.entries(hit._source)
            .map(([field, value]) => `${field}: ${value}`)
            .join(',');
          console.log(fields);
          return fields;
        });
        console.log(arr);
        res.status(200).json({
          message:"Data Retrived SuccessFully",
          object:arr
        });
      }
      else {
        res.status(404).json(
          {
            message:'Data Not Found'
          }
        );
      }
    }
    else {
      res.status(409).json({ 
        message: 'Domain Already Exists'
       });
    }
  } catch (error) {
    console.error('Line 115 : Error reading data >>> ', error);
    res.status(500).json({ 
      message: 'Internal Server Error' });
  }
}
const getallDocuments = async (req, res) => {
  try {
    const indexExists = await client.indices.exists({
      index: `${req.query.domain}_${req.query.subdomain}`
    });
    if (indexExists.body == true) {

      const response = await client.search({
        index: `${req.query.domain}_${req.query.subdomain}`,
        body: {
          query: {
            match_all: {

            }
          }
        }
      });
      const filteredHits = response.body.hits.hits
        .filter((hit) => hit._id !== 'count')
        .map((hit) => ({
          _id: hit._id,
          _source: hit._source,
        }));
      //console.log(hits[0]);
      res.status(200).json({
        message:"Data Retrieved Successfully",
        object:filteredHits
      }
        );
      //res.json(ko);
      const { body1 } = await client.update({
        index: `${req.query.domain}_${req.query.subdomain}`, // Replace with the Elasticsearch index name
        id: 'count', // Replace with the document ID you want to update
        body: {
          script: {
            source: 'ctx._source.s_count += params.increment',
            lang: 'painless',
            params: {
              increment: 1 // The value to increment by (e.g., increment by 1)
            }
          }
        }
      });
    }
    else {
      res.status(404).json({ 
        message: 'Domain Not Exists' 
      });
    }
  } catch (error) {
    res.status(500).json({ 
      message: 'Internal Server Error' });
  }

}
const signUp = async (req, res) => {
  try {
    const indexExists = await client.indices.exists({
      index: `${req.query.domain}_${req.query.subdomain}`,
    });
    const id = req.query.phone;
    console.log(indexExists.body);
    console.log(id);
    const data = { password: req.query.password, events: [] };
    console.log(req.query.password);
    // console.log(id);
    if (indexExists.body == true) {
      const id = req.query.phone; // Assuming 'phone' is the ID you want to check
      const documentExists = await client.exists({
        index: `${req.query.domain}_${req.query.subdomain}`,
        id: id
      });
      console.log(documentExists.body);
      if (documentExists.body == false) {
        const indexParams = {
          index: `${req.query.domain}_${req.query.subdomain}`,
          id: id,
          body: data
        };
        await client.index(indexParams);
        const { body1 } = await client.update({
          index: `${req.query.domain}_${req.query.subdomain}`,
          id: 'count',
          body: {
            script: {
              source: 'ctx._source.c_count += params.increment',
              lang: 'painless',
              params: {
                increment: 1
              }
            }
          }
        });
        res.status(200).json({ 
          message: 'User Created Successfully' 
        });
      }
      else {
        res.status(200).json({ 
          message: 'User Already Exists' });
      }
    }
    else {
      res.status(200).json({ 
        message: 'Domain Not Available' 
      });
    }
  } catch (error) {
    res.status(500).json({ 
      message:"Internal Server Error"
     });
  }
}
const updateDocument = async (req, res) => {
  try {
    const indexExists = await client.indices.exists({
      index: `${req.query.domain}_${req.query.subdomain}`,
    });
    const id = req.query.phone;
    console.log(indexExists.body);
    console.log(id);
    const data = { password: req.query.password };
    // console.log(id);
    if (indexExists.body == true) {
      const id = req.query.phone; // Assuming 'phone' is the ID you want to check
      const documentExists = await client.exists({
        index: `${req.query.domain}_${req.query.subdomain}`,
        id: id
      });
      console.log(documentExists.body);
      if (documentExists.body == true) {
        const index = `${req.query.domain}_${req.query.subdomain}`
        //console.log(req.body)
        // Fetch the existing document, if it exists
        const { body: existingDoc } = await client.get({
          index,
          id
        });
        // Merge the existing document with the update body (changing existing field names)
        const updatedDoc = {
          ...existingDoc._source,
          ...req.body,
        };
        // Update the document in Elasticsearch with upsert option
        console.log(req.body);
        const response = await client.update({
          index,
          id,
          body: {
            doc: updatedDoc,
            upsert: req.body, // This will create new fields if they don't exist
          },
        });
        //res.json(response);

        const { body1 } = await client.update({
          index: index,
          id: 'count',
          body: {
            script: {
              source: 'ctx._source.u_count += params.increment',
              lang: 'painless',
              params: {
                increment: 1
              }
            }
          }
        });
        //console.log(response);
        console.log(1);
        res.status(200).json({ 
          message: 'User Data Updated Successfully' });
      }
      else {
        console.log(1);
        res.status(200).json({
            message: 'User Not Exists' });
      }
    }
    else {
      //console.log(1);
      res.status(200).json({ 
        message: 'Domain Not Available'
       });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ 
      message: 'Internal Server Error' 
    });
  }
}
const deleteDocument = async (req, res) => {
  try {
    const indexExists = await client.indices.exists({
      index: `${req.query.domain}_${req.query.subdomain}`,

    });
    const id = req.query.phone;
    console.log(indexExists.body);
    console.log(id);
    // console.log(id);
    if (indexExists.body == true) {
      const id = req.query.phone; // Assuming 'phone' is the ID you want to check
      const documentExists = await client.exists({
        index: `${req.query.domain}_${req.query.subdomain}`,
        id: id
      });
      console.log(documentExists.body);
      if (documentExists.body == true) {
        const { body } = await client.delete({
          index: `${req.query.domain}_${req.query.subdomain}`, // Replace with the Elasticsearch index name
          id: id, // Replace with the document ID you want to delete
        });
        const { body1 } = await client.update({
          index: `${req.query.domain}_${req.query.subdomain}`, // Replace with the Elasticsearch index name
          id: 'count', // Replace with the document ID you want to update
          body: {
            script: {
              source: 'ctx._source.d_count += params.increment',
              lang: 'painless',
              params: {
                increment: 1 // The value to increment by (e.g., increment by 1)
              }
            }
          }
        });
        res.status(200).json({
           message: 'User Deleted Successfully' 
          });
      }
      else {
        res.status(404).json({ 
          message:'User Not Exists'
        });
      }
    }
    else {
      res.status(404).json({ 
        message:'Domain Not Available'
       });
    }
  } catch (error) {
    res.status(500).json({ 
      message:"Internal Server Error"
       });
  }
}
const search = async (req, res) => {
  const str = req.query.searchstring.toString();
  const category = req.query.category.toString();
  const latitude = req.query.latitude;
  const longitude = req.query.longitude;
  // const geo = {
  //   latitude: req.query.latitude,
  //   longitude: req.query.longitude
  // };
  const indexExists = await client.indices.exists({
    index: `${req.query.domain}_${req.query.subdomain}`
  });
  console.log(indexExists.body);
  const maxDistance = 4000;
  console.log(category);
  try {
    if (indexExists.body) {
      if (str =="null" && category != "null") {
        console.log(latitude, longitude);
        const { body } = await client.search({
          index: `${req.query.domain}_${req.query.subdomain}`,
          body: {
            query: {
              bool: {
                filter: [
                  {
                    geo_distance: {
                      distance: "2km",
                      location: {
                        lat: req.query.latitude,
                        lon: req.query.longitude
                      }
                    }
                  },
                  {
                    term: {
                      category: category.toLowerCase() // Filter by category
                    },
                    
                  },
                  // Additional filters can be added here if needed
                ]
               

              }

            }
          }
        });
        // Extract and send back the matching documents
        const results = body.hits.hits.map(hit => hit._source);
        res.status(200).json({
          message:"fetched results 2km based on lat lon",
          object:results
        });
        console.log(results);
      }
      else if(str=="null" && (category=="null" || category=="All"))
      {
        console.log(1);
        const { body } = await client.search({
          index: `${req.query.domain}_${req.query.subdomain}`,
          body: {
            query: {
              bool: {
                filter: [
                  {
                    geo_distance: {
                      distance: "2km",
                      location: {
                        lat: req.query.latitude,
                        lon: req.query.longitude
                      }
                    }
                  },
                
                  // Additional filters can be added here if needed
                ]
               

              }

            }
          }
        });
        // Extract and send back the matching documents
        const results = body.hits.hits.slice(0, 10).map(hit => hit._source);
        res.status(200).json({
          message:"fetched results 2km based on lat lon",
          object:results
        });
        console.log(results);
      }
      else {
        console.log("helloqwertyu");
        if (category!="null" && str!="null") {
          console.log(str);
          const { body } = await client.search({
            index: `${req.query.domain}_${req.query.subdomain}`,
            body: {
              query: {
                bool: {
                  filter: [
                    {
                      term: {
                        category: category.toLowerCase() // Filter by category
                      },
                      
                    },
                    
                    
                  ],
                  must: [
                    {

                      query_string: {
                        fields: ['name','category'],
                        query: `*${str.toLowerCase()}*`,
                      },

                    }
                  ]
                }
              }
            }
          });
          // Extract and send back the matching documents
          const results = body.hits.hits.map(hit => hit._source);
          console.log(results);
          res.status(200).json({
            message:"Fetched results by category and name",
            object:results
          });
        }
        else 
        {
          try {
              const { body } = await client.search({
                index: req.query.indexname,
                body: {
                  query: {
                    query_string: {
                      fields: ['name'],
                      query: `*${str}*`,
                    },
                  },
                  highlight: {
                    fields: {
                      "*": {}
                    }
                  }
                },
              });
              const hits = body.hits.hits;
              console.log(hits);
              if (hits.length > 0) {
                // const arr = hits.slice(0, 10).map(hit => {
                //   const fields = Object.entries(hit._source)
                //     .map(([field, value]) => `${field}: ${value}`)
                //     .join(',');
                //   console.log(fields);
                //   return fields;
                // });
                const arr=hits.slice(0, 10).map(hit => hit._source);
                console.log(arr);
                console.log(1);
                res.status(200).json({
                  message:'Fetched Results based on Category and String',
                  object:arr
                }
                );
            }
            else {
              res.status(404).json({
                 message: 'Data Not Found' 
                });
            }
          } catch (error) {
            console.error('Line 115 : Error reading data >>> ', error);
            res.status(500).json({ 
              message:'Internal Server Error'
             });
          }
        }
      }
    }
    else {
      res.status(404).json({ 
        message: 'Domain Not Available' 
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      message: 'Internal Server Error' });
  }
  // console.log("hello");
  // console.log(req.query.latitude);
  // console.log(req.query.longitude);

}
const getCount = async (req, res) => {
  try {
    console.log(req.query.indexname);
    const indexExists = await client.indices.exists({
      index: req.query.indexname
    });
    if (indexExists.body == true) {
      const documentExists = await client.exists({
        index: req.query.indexname,
        id: 'count'
      });
      console.log(documentExists.body);
      if (documentExists.body == true) {
        const { body } = await client.get({
          index: req.query.indexname, // Replace with the Elasticsearch index name
          id: 'count', // Replace with the document ID you want to retrieve
        });

        res.status(200).json({
          object:body._source
        });
        //console.log(body._source);
      }
      else {
        res.status(404).json({ 
          message: 'Document Not Exists'
         });
      }
    }
    else {
      res.status(404).json({
         message: 'Domain Not Available'
         });
    }

  }
  catch (error) {
    res.status(500).json({ 
      message: 'Internal Server Error'
     });
  }
}
const createapi = async (req, res) => {
  try {
    res.status(200).json({ 
      message: process.env.SERVER_URL + "/" + req.query.indexname,
     });
  } catch (error) {
    //console.error('Error:', error);
    res.status(500).json(
      {
      message:"Internal Server Error",
      }
    );
  }
}
const deletedomain = async (req, res) => {
  try {
    const indexExists = await client.indices.exists({
      index: `${req.query.domain}`
    });
    console.log(indexExists.body);
    if (indexExists.body) {
      const { body } = await client.indices.delete({
        index: req.query.domain,
      });
      res.status(200).json({ 
        message: 'Deleted Succesfully'
       });
    }
    else {
      res.status(404).json({
         message: 'Domain not Exists'
      });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      message:"Internal Server Error"
    });
  }
}
const updatedomain = async (req, res) => {
  try {
    const oldindexExists = await client.indices.exists({
      index: `${req.query.oldindex}`
    });
    const newindexExists = await client.indices.exists({
      index: `${req.query.newindex}`
    });
    console.log(oldindexExists.body);
    console.log(newindexExists.body);
    if (oldindexExists.body && newindexExists.body == false) {

      await client.indices.create({ index: req.query.newindex });

      await client.reindex({
        body: {
          source: { index: req.query.oldindex },
          dest: { index: req.query.newindex },
        },
      });
      await client.indices.delete({ index: req.query.oldindex });
      res.status(200).json({ 
        message: 'Domain name updated successfully.' 
      });
    }
    else {
      if (oldindexExists.body == false) {
        res.status(404).json({ 
          message: 'Domain Not Exists' 
        });
      }
      else if (newindexExists.body == true) {
        res.status(409).json({
           message: 'Newly Entered Domain Exists'
        });
      }
    }
  } catch (error) {
    //console.error('Error:', error);
    res.status(500).json({
      message:'Internal Server Error'
    });
  }
}
const auth = async (req, res) => {
  //console.log(1);
  try {
    const indexExists = await client.indices.exists({
      index: `${req.query.domain}_${req.query.subdomain}`,

    });
    const id = req.query.phone;
    console.log(indexExists.body);
    console.log(id);
    // console.log(id);
    if (indexExists.body == true) {
      const id = req.query.phone; // Assuming 'phone' is the ID you want to check
      const documentExists = await client.exists({
        index: `${req.query.domain}_${req.query.subdomain}`,
        id: id
      });
      console.log(documentExists.body);
      if (documentExists.body == true) {
        const { body: document } = await client.get({
          index: `${req.query.domain}_${req.query.subdomain}`,
          id: id,
        });

        const fieldValue = document._source.password; // Replace 'fieldName' with your field name

        // Compare fieldValue with the expected value
        const expectedValue = req.query.password; // Replace with the value you want to compare
        console.log(fieldValue);
        if (fieldValue === expectedValue) {
          res.status(200).json({ 
            message: 'True' 
          });
        }
        else {
          res.status(200).json({ 
            message: 'Wrong Password' 
          });
        }
      }
      else {
        res.status(200).json({ 
          message: 'User Not Exists'
         });
      }
    }
    else {
      res.status(200).json({ 
        message: 'Not Registered'
       });
    }
  } catch (error) {
    res.status(500).json({ 
      message: 'Internal Server Error'
     });
  }
}
const createsubindex = async (req, res) => {
  try {
    const indexExists = await client.indices.exists({
      index: `${req.query.domain}`
    });
    if (indexExists.body) {
      const document = {
        d_count: 0,
        c_count: 0,
        u_count: 0,
        s_count: 0
      }
      const createAliasParams = {
        index: req.query.domain,
        name: req.query.subdomain
      };
      await client.indices.putAlias(createAliasParams);
      await client.index({
        index: `${req.query.domain}_${req.query.subdomain}`,
        id: 'count',
        body: document
      });
      res.status(200).json({ 
        message: 'Subdomain Created Successfully', 
      });
    }
    else {
      res.status(200).json({ 
        message: 'Domain Not Found' 
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      message: 'Internal Server Error' 
    });
  }
}
const getSpecificDocument = async (req, res) => {
  try {
    const indexExists = await client.indices.exists({
      index: `${req.query.domain}_${req.query.subdomain}`,

    });
    const id = req.query.phone;
    console.log(indexExists.body);
    console.log(id);
    // console.log(id);
    if (indexExists.body == true) {
      const id = req.query.phone; // Assuming 'phone' is the ID you want to check
      const documentExists = await client.exists({
        index: `${req.query.domain}_${req.query.subdomain}`,
        id: id
      });
      console.log(documentExists.body);
      if (documentExists.body == true) {
        const { body: document } = await client.get({
          index: `${req.query.domain}_${req.query.subdomain}`,
          id: id,
        });
        const data = document._source;
        console.log(data);
        res.status(200).json({
          message:"Data Retrieved Successfully",
          object:data,
        });
      }
      else {
        res.status(200).json({
          message:"User Not Found",
        })
      }
    }
    else {
      res.status(200).json({
        message:"Not Registered",
      });
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message:"Internal Server Error",
    });
  }
}
const getEvent = async (req, res) => {

  try {
    const indexExists = await client.indices.exists({
      index: `${req.query.domain}_${req.query.subdomain}`,
    });
    // console.log(id);
    if (indexExists.body == true) {
      const id = req.query.phone; // Assuming 'phone' is the ID you want to check
      const documentExists = await client.exists({
        index: `${req.query.domain}_${req.query.subdomain}`,
        id: id
      });
      console.log(documentExists.body);
      if (documentExists.body == true) {
        try {
          const operation = req.query.crud.toLowerCase();
          if (operation == "create") {
            try {
              const { body } = await client.get({
                index: `${req.query.domain}_${req.query.subdomain}`,
                id: id,
              });
              const document = body._source;
              const events = body._source.events;
              let previousEventId = 0;
              if (events.length > 0) {
                // Get the last event in the array
                const lastEvent = events[events.length - 1];
                // Extract the numeric part of the previous event ID and increment it
                previousEventId = parseInt(lastEvent.id.replace(/^\D+/g, ''), 10) + 1;

              }
              // Create the new event ID by prefixing with 'event_' and appending the incremented value
              
              const newEventId = `event_${previousEventId}`;
              const newEvent = {
                id: newEventId,
                ...req.body,
                
              };              
              console.log(newEvent);
              document.events.push(newEvent);
              console.log(document);
              const result=await client.update({
                index: `${req.query.domain}_${req.query.subdomain}`,
                id: id,
                body: {
                  doc: document,
                },
              });
              console.log(result);
              res.status(200).json({
                message:"Event Added Successfully",
              });
            }
            catch (error) {
              console.log(error);
              res.status(500).json({
                message:"Internal Server Error",
              });
            }
          }
          else if (operation == "edit") {
            try {
              const { body } = await client.get({
                index: `${req.query.domain}_${req.query.subdomain}`,
                id: id,
              });
              const document = body._source;
              const events = body._source.events;
              // Find the event in the events array based on some unique identifier
              const eventIndex = events.findIndex(event => event.id === req.body.id);
              if (eventIndex !== -1) {
                // Update the event with the new data
                events[eventIndex] = req.body;
                // Update the document with the modified events array
                document.events = events;
                await client.update({
                  index: `${req.query.domain}_${req.query.subdomain}`,
                  id: id,
                  body: {
                    doc: document,
                  },
                });

                res.status(200).json({
                  messsage:"Event edited Successfully",
                });
              } else {
                res.status(200).json({
                  message:"Event Not Found"
                });
              }
            } catch (error) {
              res.status(500).json({ 
                message: 'Internal Server Error' ,
              });
            }

          }
          else if (operation == "delete") {
            try {
              const { body } = await client.get({
                index: `${req.query.domain}_${req.query.subdomain}`,
                id: id,
              });
              const document = body._source;
              const events = body._source.events;
              // Find the event in the events array based on some unique identifier
              const eventToDelete = events.find(event => event.id === req.query.eventid);
              if (eventToDelete) {
                // Use filter() to create a new array excluding the event to delete
                const updatedEvents = events.filter(event => event.id !== req.query.eventid);
                // Update the document with the new events array
                document.events = updatedEvents;
                await client.update({
                  index: `${req.query.domain}_${req.query.subdomain}`,
                  id: id,
                  body: {
                    doc: document,
                  },
                });
                res.status(200).json({ 
                  message: 'Event Deleted Successfully' , 
                });
              } else {
                res.status(200).json({ 
                  message: 'Event Not Found',
                 });
              }
            } catch (error) {
              res.status(500).json({ 
                message: 'Internal Server Error', 
               });
            }
          }
        }
        catch (error) {
          res.status(500).json({
            message: 'Internal Server Error',
          });
        }
      }
      else {
        res.status(200).json({
          message: 'User Not Exists'
         });
      }
    }
    else {
      res.status(200).json({ 
        message: 'Not Registered'
       });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Internal Server Error'
     });
  }
}
const livelocation=async(req,res)=>{
  try {
    const indexExists = await client.indices.exists({
      index: `${req.query.domain}_${req.query.subdomain}`,
    });
    const id = req.query.phone;
    console.log(indexExists.body);
    console.log(id);
    if (indexExists.body == true) {
      const id = req.query.phone; // Assuming 'phone' is the ID you want to check
      const documentExists = await client.exists({
        index: `${req.query.domain}_${req.query.subdomain}`,
        id: id
      });
      console.log(documentExists.body);
      if (documentExists.body == true) {
        const updatedLocation = {
          lon: parseFloat(req.query.longitude),
          lat: parseFloat(req.query.latitude)
        };
        // Use the update API to update the document
        const updateResponse = await client.update({
          index: `${req.query.domain}_${req.query.subdomain}`,
          id: id,
          body: {
            doc: {
              location: updatedLocation,
            },
          },
        });
        if (updateResponse.body) {
          res.status(200).json({
            message: 'Location updated successfully',
          });
        } else {
          res.status(500).json({
            message: 'Failed to update location',
          });
        }
      }
      else {
        res.status(409).json({ 
          message: 'User Not Exists'});
      }
    }
    else {
      res.status(404).json({ 
        message: 'Domain Not Available' 
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message:"Internal Server Error"
     });
  }
}
const forgotpassword=async(req,res)=>{
  try {
    const indexExists = await client.indices.exists({
      index: `${req.query.domain}_${req.query.subdomain}`,
    });
    const id = req.query.phone;
    console.log(indexExists.body);
    console.log(id);
    if (indexExists.body == true) {
      const id = req.query.phone; // Assuming 'phone' is the ID you want to check
      const documentExists = await client.exists({
        index: `${req.query.domain}_${req.query.subdomain}`,
        id: id
      });
      console.log(documentExists.body);
      if (documentExists.body == true) {
        const updateResponse = await client.update({
          index: `${req.query.domain}_${req.query.subdomain}`,
          id: id, // Assuming 'id' is the document ID you want to update
          body: {
            doc: {
              password: req.query.newpassword,
            },
          },
        });
        //console.log(updateResponse);
        if (updateResponse.body) {
            res.status(200).json({ 
              message: 'Password Updated Successfully' 
            });
          }
          else
          {
            res.status(200).json({
              message: 'Failed to Update Password',
            });
          }
      }
      else {
        res.status(200).json({ 
          message: 'User Not Exists'});
      }
    }
    else {
      res.status(200).json({ 
        message: 'Domain Not Available' 
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message:"Internal Server Error"
     });
  }
}
const getReports=async(req,res)=>{
  try {
    const indexExists = await client.indices.exists({
      index: `${req.query.domain}_${req.query.subdomain}`,

    });
    const id = req.query.phone;
    console.log(indexExists.body);
    console.log(id);
    // console.log(id);
    if (indexExists.body == true) {
      const id = req.query.phone; // Assuming 'phone' is the ID you want to check
      const documentExists = await client.exists({
        index: `${req.query.domain}_${req.query.subdomain}`,
        id: id
      });
      console.log(documentExists.body);
      if (documentExists.body == true) {
        const { body: document } = await client.get({
          index: `${req.query.domain}_${req.query.subdomain}`,
          id: id,
        });
        const data = document._source;
        console.log(data.events);
        const filteredEvents = data.events.filter(event => {
          const eventStartDate = event.start_date;
          const eventEndDate = event.end_date;
          const queryStartDate = req.query.startdate;
          const queryEndDate = req.query.enddate;
        
          return (
            (queryStartDate >= eventStartDate && queryStartDate<=eventEndDate) || (queryEndDate >= eventEndDate && queryEndDate>=eventStartDate)
          );
        });
        
        console.log(filteredEvents);
        res.status(200).json({
          message:"Data Retrieved Successfully",
          object:filteredEvents,
        });
      }
      else {
        res.status(200).json({
          message:"User Not Found",
        })
      }
    }
    else {
      res.status(200).json({
        message:"Not Registered",
      });
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message:"Internal Server Error",
    });
  }
}
module.exports = {
  createIndex,
  getDomain,
  getText,
  getallDocuments,
  signUp,
  updateDocument,
  deleteDocument,
  search,
  getCount,
  deletedomain,
  createapi,
  updatedomain,
  auth,
  createsubindex,
  getSpecificDocument,
  getEvent,
  forgotpassword,
  livelocation,
  getReports
}








