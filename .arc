@app
begin-app

@http
post /graphql

@static
folder public

@tables
data
  scopeID *String
  dataID **String
  ttl TTL
