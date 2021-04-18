document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views

  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);
  document.querySelector('#compose-form').addEventListener("submit", send_email);

  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#email-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function send_email() {
  //assign values to consts
  const recipients = document.querySelector("#compose-recipients").value;
  const subject = document.querySelector("#compose-subject").value;
  const body = document.querySelector("#compose-body").value;

//hit the API to POST an email with the above const values
    fetch('/emails', {
      method: 'POST',
      body: JSON.stringify({
          recipients: recipients,
          subject: subject,
          body: body
      })
    })
    .then(response => response.json())
    .then(result => {
          console.log(result);
          return false;
        });
    };

    //allows user to reply to mail
function reply_mail(id) {
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#email-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  fetch(`/emails/${id}`)
        .then(response => response.json())
        .then(email => {
            // Print email
            console.log(email); 

  document.querySelector('#compose-recipients').value = email.recipients;
  document.querySelector('#compose-subject').value = "RE: " + email.subject;
  document.querySelector('#compose-body').value = `On ${email.timestamp}, ${email.sender} wrote \n\n ${email.body} \n---------------------------------------\n\n`;
  document.querySelector('#compose-form').addEventListener("submit", send_email);        

  });

}

//function that unarchives email, changing object "archived" to true
function archive_mail(id)  {
  
  fetch(`/emails/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
        archived: true
    })
  })
  .then((json) => {
    load_mailbox('inbox');
  });
}

//function that unarchives email, changing object "archived" to false
function unarchive_mail(id) {
  fetch(`/emails/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
        archived: false
    }) 
     })
     .then((json) => {
      load_mailbox('inbox');
  });
     
}


//function that changes the read value in the object to True
function email_read(id){

  fetch(`/emails/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
        read: true  
    })
  });

}


function load_mailbox(mailbox) {

  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#email-view').style.display = 'none';

 
  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

    fetch(`/emails/${mailbox}`)
     .then(response => response.json())
     .then(emails => { 
       console.log(emails);
     
        emails.forEach(emails => {
        const item_sub = document.createElement('div');
        const item_sender = document.createElement('div');
        const item_id = emails.id;
        const item_timestamp = emails.timestamp;
        item_sub.innerHTML = "Subject: " + emails.subject;
        item_sender.innerHTML = "From: " + emails.sender;
        item_timestamp.innerHTML = "On: " + emails.timestamp;
        item_sub.addEventListener('click', function() {
            load_email(item_id);
        });

        document.querySelector('#emails-view').append(item_sub);
        document.querySelector('#emails-view').append(item_sender);
        document.querySelector('#emails-view').append(item_timestamp); 

      });
    
    })
  
  };

  function load_email(id) {

     // Clear out composition fields
      document.querySelector('#email-view').innerHTML = '';
    //GET request using email id as argument 
    fetch(`/emails/${id}`)
        .then(response => response.json())
        .then(email => {
            // Print email
            console.log(email);
            email_read(id);
       
        const item_sender = document.createElement('div');
        const item_sub = document.createElement('div');
        const item_body = document.createElement('div');
        const item_button = document.createElement('div');
        const item_archive = document.createElement('div');
        const item_unarchive = document.createElement('div');
        const item_timestamp = document.createElement('div');
        const item_id = email.id;
        // Show compose view and hide other views
        document.querySelector('#emails-view').style.display = 'none';
        document.querySelector('#compose-view').style.display = 'none';
        document.querySelector('#email-view').style.display = 'block';
        
        item_button.innerHTML = '<input type = "submit" class="btn btn-primary" value = "Reply">';
        item_button.addEventListener('click', function () {
          reply_mail(item_id);
      });
      if (email.archived == true)
            {
              item_unarchive.innerHTML = '<input type = "submit" class="btn btn-primary" value = "Unarchive">';
              item_unarchive.addEventListener('click', function () {
                      unarchive_mail(item_id);
                    });
            }
      else
            {
        item_archive.innerHTML = '<input type = "submit" class="btn btn-primary" value = "Archive">';
        item_archive.addEventListener('click', function () {
          archive_mail(item_id);
        });
            }
        item_sub.innerHTML = "Subject: " + email.subject;
        item_sender.innerHTML = "From: " + email.sender;
        item_timestamp.innerHTML = "On:" + email.timestamp;
        item_body.innerHTML = email.body;

        document.querySelector('#email-view').append(item_button);
              item_button.style.padding = "5px";
        if (email.archived == true)
            {
              document.querySelector('#email-view').append(item_unarchive);
              item_unarchive.style.padding = "5px";
            }
        else 
            {
              document.querySelector('#email-view').append(item_archive);
              item_archive.style.padding = "5px";
            }
        document.querySelector('#email-view').append(item_sub);
        document.querySelector('#email-view').append(item_sender);
        document.querySelector('#email-view').append(item_timestamp);
        document.querySelector('#email-view').append(item_body);

      });

  }
 

  