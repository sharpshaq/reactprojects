import { Meteor } from 'meteor/meteor';
import { Links } from "../imports/collections/links";
import { WebApp } from "meteor/webapp";
import ConnectRoute from "connect-route";

Meteor.startup(() => {
  Meteor.publish("links", function(){
    return Links.find({});
  });
});


// Executed whenever a user visits with a route like
// "localhost:3000/abcd"
function onRoute(req, res, next) {
  // Take the token out of the url and try to find a
  // matching link in the links collection
  const link = Links.findOne({ token: req.params.token });


  
  if (link) {
    // If we find a link object, redirect user to the
    //long url
    //To update records in mongo collection
    Links.update(link, { $inc: { clicks: 1}});
    res.writeHead(307, { "Location": link.url});
    res.end();
  } else {  
    //if we do not find a link object, send the user
    //to our normal react app. 
    next();
  }
}



//    localhost:3000/ NO MATCH
//    localhost:3000/books/harry_pooter NO MATCH
//    localhost:3000/abcd will match!!!

const middleware = ConnectRoute(function(router){
  router.get("/:token", onRoute);
});

j

WebApp.connectHandlers.use(middleware);