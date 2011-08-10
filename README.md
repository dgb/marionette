Marionette
================================================================================
A Lightweight Client-side Application Library
--------------------------------------------------------------------------------

Marionette is inspired by HTTP and Sinatra.

Many Javascript frameworks provide a heavy framework on the client that causes duplication in architecture.

Marionette eschews this, and instead has the client behave like its namesake. The idea is: we've already written this application for the server, so why not simply have the browser behave accordingly? Essentially, we design the client-side application so that its dispatch cycle mimics what would happen in a page-based, server side system, but taking advantage of lighter data-based payloads.

We do this by:

* Binding views to URLs rather than an intermediate data object.
* Making a request with every dispatch.
* Use HTTP caching so that those requests are completed quickly.
* Using event delegation to dispatch anchor clicks to the appropriate view.
* Completely redrawing the view with every dispatch.

In this way, you can utilize the existing server-side application in order to drive the client-side one. Indeed, with technology like Mustache, you can share even templates between the two.

Marionette will not depend on any external libraries. It's intended to be used "invisibly" with another library that you might use in an application that refreshes every page.

Right now, Marionette serves as more of a proof of concept than anything else. Here are some things I need to improve:

* Cross browser compatibility. This is caused by not having dependencies on any particular library.
* Ensure compatibility with popular client side libraries.
* Make a Rack middleware that detects incoming headers and modifies them appropriately (i.e. the Location header)
* Use Link headers instead of customer headers for templates and lazily load them.
* Tests, dummy.