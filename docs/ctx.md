# Sharing Context

Qubit manages context on a per HTTP request basis. That is, for every incomming HTTP request a new
`Ctx` instance will be generated. This occurs in the `service_fn` closure within the `to_service`
method on `Router`. This process will include calling the user-defined `build_ctx` method with the
incomming HTTP request, allowing for the state to be populated using request information, including
headers. Unfortunately, due to the nature of how Axum nests services, the underlying connection
(and therefore information like the IP address of the upstream request initiator) is not accessible
to the context builder. If this is a problem, then raise an issue.

## Case Study: Authentication

As an example, let's explore two possibilities for authenticating a client.

### Cookie Authentication

The most straight forward setup would be to use server-set cookies to authenticate the client. Some
action from the client initiates a request to the client to set a cookie, which will be sent on
every consecutive request. There are some limitations for this method:

- The cookie setting must be handled outside of Qubit. In an effort for handlers to be re-usable
  for both HTTP and WebSocket clients, it is not possible for cookies to be set from a handler. A
  simple solution for this would be a regular login form that can be `POST`ed to the server, before
  redirecting back to the app.

- The cookie must be present before the Qubit client connects. This is especially important for the
  WebSocket client where the connection is persisted.

This authentication method is best suited for clients that are serviced over HTTP.

See the sample at [`cookie.rs`](../examples/authentication/src/cookie.rs).

### Mutable Context

An alternate option is to perform the authentication over the connection, although this only works
with the WebSocket client as the context must be persisted between queries. This method is
therefore best suited for clients communicating over WebSockets.

See the sample at [`mutable_ctx.rs`](../examples/authentication/src/mutable_ctx.rs).