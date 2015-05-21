
    // Funktion som ser till att användaren fyller i ett användarnamn.
    function validateUsername() { 
      var username = $("#username"); 
      var x = username.val();  
      if (x == null || x == "") 
        { alert("Välj ett namn"); 
      return false; } 
      else { 
        $("#loggin").hide(); 
        $("#chats").show(); 
        $("#username").hide(); 
        $("#infobox").hide(); 
      } 
    }

    $(function() {

      // Hämtar element från HTML-koden
      var username =$("#username");
      var input1 = $("#input1");
      var sendbutton1 = $("#sendbutton1");
      var output1 = $("#output1");
      var input2 = $("#input2");
      var sendbutton2 = $("#sendbutton2");
      var output2 = $("#output2");
      var impobtn = $("#important");
      var spambtn = $("#spam");
      var hello = $("#hello");
      var hello1 = $("#hello1");

      //Skapar tomma listor
      var messagelist = [];
      var userlist = [];
      
      // Init PubNub
      var pubnub = PUBNUB.init({
        publish_key   : "pub-c-c28df6e6-db95-4fbb-9dec-e9c158810787",
        subscribe_key : "sub-c-d6fc11ce-ea76-11e4-85d8-02ee2ddab7fe",
      });

      //Hämtar och retunerar användarnamn från input.
      var getUsername = function() {
        var user = username.val();
        return user;
      }

/// -------- VIKTIGA CHATRUMMET ---------------------///
      
      // Subscribe till viktigachatten, 
      impobtn.on('click', function() {
        var me = getUsername();
        pubnub.subscribe({
              channel : 'impo',
              message: function(data) {
                if(data.username == me) {
                  userstyle = 'myself';
                }
                else{
                  userstyle = 'else'
                }
                output1.html('<div class="'+userstyle+'">' +data.username + ': ' +data.text + '</div>'+'<br />'+output1.html())
              }
        });

        str = "<h3>Hej "+ me +"!</h3><h5> Du är i den viktiga chatten. Behave.</h5>";
        hello.html(str);
      });

      // Skicka meddelanden
      sendbutton1.on('click', function() {
        var me = getUsername();
        console.log(me);
        var usermess = me + input1.val();
        pubnub.publish({
              'channel' : 'impo',
              message: {
                text: input1.val(),
                username: me,
              }
        });
        // Rensar inputfältet när användaren klickat på skicka
        input1.val('');
        messagelist.push(usermess);
      });


///--------- SPAM CHATRUMMET ------------------ ///

      // Subscribe till spamchatten
      spambtn.on('click', function() {
        var me = getUsername();
        pubnub.subscribe({
              channel : 'spam',
              message: function(data) {
                // För att meddelandena ska gå att styla beroende på vem som skickar; användaren eller alla andra. 
                if(data.username == me) {
                  userstyle = 'myself';
                }
                else{
                  userstyle = 'else'
                }
                output2.html('<div class="'+userstyle+'">' +data.username + ': ' +data.text + '</div>'+'<br />'+output2.html())
              }
        });

        str = "<h3>TJAA "+ me +"!</h3><h5> Varsågod. SPAMMA!</h5>";
        hello1.html(str);
      });

      // send messages 
      sendbutton2.on('click', function() {
        var me = getUsername();
        var usermess = me + input2.val();
        pubnub.publish({
              'channel' : 'spam',
              message: {
                text: input2.val(),
                username: me,
              } 
        });
        // Rensar inputfältet när användaren klickat på skicka
        input2.val('');
        messagelist.push(usermess);
      });
    }); // END $(function()