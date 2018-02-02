### Title:
# It's Magic In...

### Description:
I want to help photographers master the magic hour. My app will tell the user when the magic hour will happen each day, depending on location. Magic hour is an hour or so before sunset and after sunrise when natural light is 👌👌👌. I want to animate the solar cycle as well so the app will be beautiful as well as practical. I plan to add sms reminder feature using Twilio API if I have time. 

### Technical Detail:
- Webapp will be built on Node.js using Express MVC architecture
- There are going to be two models: users and magic-hour
- pg-promise will be used for accessing local database
- axios will be used for making external api calls
- bcrypt will be used for auth and password encryption in db
- Moment.js will be used for time keeping

### Minimum Viable Product (MVP):
- User login/registration ✅
- Real-time clock ✅
- Magic hour reminders based on sunset-sunrise API (https://sunrise-sunset.org/api)
- Animate solar cycle ✅
### Reach Goals:
- Add Twilio API (https://www.twilio.com/docs/api/rest) for scheduled notifications via SMS
- Authentication - bcrypt ✅
- Geolocation (https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/Using_geolocation) ✅
### Potential Blockers:
- Interfacing the API may be tricky
### Timeline:
**Thursday**
- Brainstorm ideas ✅
- Create a repository ✅

**Friday:**
- Determine specifications ✅
- Flow chart ✅
- Wireframe ✅
- Start working on boilerplate express mvc ✅
- Able to hit the sunset api ✅

**Saturday:**
- Complete boilerplate + skeleton ✅
- Create DB ✅
- Create schema ✅
- Create mvc for login/register/profile ✅
- Add authentication ✅

**Sunday:**
- Add real-time clock ✅
- Calculate magic hour times based on sunset/sunrise time ✅
- Add notifications
- Animate the solar cycle in the background ✅

**Monday**
- Complete MVP ✅
- Add Twilio API for sending SMS
- Create scheduler that will text Magic Hour Reminders
- Add documentation 

**Tuesday**
- Upload app to Heroku ✅
- Work on extra features, styling, etc. 

**Wednesday**
- Final presentation.
### Tech Stack:
- HTML5
- CSS3
- JavaScript
- jQuery
- Node.js
- AJAX
### APIs
- GeoNames WebServices API (http://www.geonames.org)
- Sunset and Sunrise API (https://sunrise-sunset.org/api)
### Packages
- express
- pg-promise
- axios
- Twilio Node Helper Library (https://www.twilio.com/docs/libraries/node)
- moment (http://momentjs.com/docs/)
- mustache-express
- body-parser
- dotenv
- bcrypts
- cookie-parser
- express-session
### Repo Link:
https://github.com/ark234/PROJECT2-FUZZY-YELLOW
