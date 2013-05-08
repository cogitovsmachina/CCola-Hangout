import webapp2
import cgi


MAIN_PAGE_HTML = """\
<html>
  <body>
  	<h1 style="text-align:center; font-family:helvetica;">Bienvenido a Coca Cola Hangout</h1>

  
   <a href="https://plus.google.com/hangouts/_?gid=1084057564826" style="text-decoration:none;">
  <img src="https://ssl.gstatic.com/s2/oz/images/stars/hangout/1/gplus-hangout-60x230-normal.png"
    alt="Inicia un Hangout"
    style="border:0;width:230px;height:60px;"/>
</a>
  </body>
</html>
"""

class MainPage(webapp2.RequestHandler):

    def get(self):
        self.response.write(MAIN_PAGE_HTML)

app = webapp2.WSGIApplication([
    ('/', MainPage),
], debug=True)