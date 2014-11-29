DaveW's 1v1 League
=============================



features
=============================


install
=============================
1) install nodejs packages

	npm update



2) create a certificate

	openssl genrsa -out key.pem 1024

	openssl req -new -key key.pem -out csr.pem

	openssl x509 -req -in csr.pem -signkey key.pem -out cert.pem



3) rename configuration.js.sample to configuration.js   



4) (optional) set the passphrase in configuration.js



5) install the database with database.sql



6) set the database username, password... in configuration.js



7) change WD variable in nodejs_davewleague



8) install the daemon

	sudo cp nodejs_davewleague /etc/init.d/
	
	sudo chmod 0755 /etc/init.d/nodejs_davewleague
	
	sudo update-rc.d nodejs_davewleague defaults


run
=============================

    node ./bin/www
    
or
    
    sudo service nodejs_davewleague start
