# Instrumenting the Notebook

<span style="font-size: 20px; color:var(--blue-grey-400); margin-top: 0px">a Model Inspired by Interactive Visualizations</span>

by [Yifan](/)

Programming notebooks are a popular medium for data analysis. In addition to code, rich text, and visualizations, notebooks can support interactions, such as [ipywidgets](https://github.com/jupyter-widgets/ipywidgets")
, or direct javascript integration in 
[observables](https://observablehq.com/"). The rich range of functionalities supported by notebooks makes them an ideal target for tools that aid in data analysis, supporting code, visuals, and interactions.

For instance, projects like [kepler.gl](https://medium.com/vis-gl/exploring-geospatial-data-with-kepler-gl-cf655839628f"), [ipyvega](https://github.com/vega/ipyvega"), and my research project, [Midas](https://github.com/yifanwu/midas), all have integrations to Jupyter Notebook.

This post will discuss a model for implementing custom interactive widgets to Python notebooks. The high-level concepts should generalize to other notebooks, such as Jupyter Lab, Colab, and [deepnote](https://www.deepnote.com/). By the end of the post, you should realize that we can do much beyond the `ipywidgets` provided. We can change the UI beyond just the output area of the cell---we can, for instance, make a dashboard! We can update the UI based not just on UI event---we can, for instance, listen to events triggered by code execution.

If you are not interested in implementation details, feel free to toggle the content: <a data-toggle="collapse" data-target=".collapse" style="font-weight: bold;">Toggle Details</a>.

## Communicating Between the Kernel and the UI

At the very basic, for any language kernel to communicate with the UI state, there needs to be a communication layer that sends events from the UI layer to the kernel and back. The UI events can be code execution, keystrokes, or interaction with some UI components (anything that can be captured by the UI). The exception is, of course, Javascript kernels running on the main thread in the browser. If it is Javascript running in Node.js or a WebWorker thread, the discussion still applies.

<div class="collapse show">

Concretely, in Jupyter notebooks, this communication can be done in (at least) two ways. One is using a custom [Jupyter Widget](https://ipywidgets.readthedocs.io/en/latest/examples/Widget%20Custom.html), or using [Comms](https://jupyter-notebook.readthedocs.io/en/stable/comms.html) (short for communication).

The first method is well documented in the [link](https://ipywidgets.readthedocs.io/en/latest/examples/Widget%20Custom.html), and you can also refer to [ipyvega](https://github.com/vega/ipyvega), for example. It is also the officially supported one. The second method, comms, is similar to all message-passing systems, like WebWorkers and the actor model. The UI sends the kernel some message, and the kernel handles that messages and sends messages back to the UI.

To pick between the two approaches, the table below draws a comparison. The Comm approach is lower level, hence more flexible and easier to learn, but possibly more tedious to write. The design of Jupyter Widgets is probably elegant, but also opinionated. If you are like me and would prefer not to learn another framework for thinking about state and control, pick _Comm_ and build your UI, for which you can use React, Vue, jQuery, etc.

</div>


<table class="table center" style="width: var(--size-14);">
 <thead>
 <tr>
 <td>Property</td>
 <td>Ipywidgets</td>
 <td>Comms</td>
 </tr>
 </thead>
 <tbody>
 <tr>
 <td>Flexibility</td>
 <td>Low</td>
 <td>High</td>
 </tr>
 <tr>
 <td>Succinct</td>
 <td>High</td>
 <td>Low</td>
 </tr>
 </tbody>
</table>

Since there is good documentation for the first approach, for the rest of this post, I'll talk in more detail about the code to set up for the second approach. For an example implementation of the first approach, see [cookiecutter widget](https://github.com/jupyter-widgets/widget-ts-cookiecutter/), and [widget.py](https://github.com/vega/ipyvega/blob/master/vega/widget.py). Now, let's begin with the UI side code on the frontend. The following is useful if you want to use **Python kernel to control UI events**

<pre><code class="javascript" id="js_handler">Jupyter.notebook.kernel.comm_manager.register_target(YOUR_COMM_NAME, handler);
function handler (comm, msg) {
 // comm will be the reference to the communication layer
 function onMessage(msg) {
 // msg.content.data will contain your message
 const load = msg.content.data;
 // you can use this message to make changes to your UI state, for example, I have `.type` in my message to inform the handler what shape to expect the message as
 switch (load.type) {
 case "hide": {
 // invoke the component to change
 // for instance, refToAReactComponent here could be 
 refToAReactComponent.hide();
 return;
 }
 case "show": {
 refToAnotherReactComponent.addSelection(load.value);
 return;
 }
 // and so on...
 }
 // now set the handler
 comm.on_msg(onMessage);
}</code></pre>

This should be the only part of your frontend code that's different from what you would have otherwise written for a traditional interface. Like all other UIs, the UI that's part of Jupyter Notebooks is changing the state of the UI, e.g., new elements, different styling, based on new events. If you have an existing UI library, adding it to the notebook requires little change. For instance, calls like `refToAReactComponent.hide()` in the snippet above.

Now, to go in the opposite direction, we need to set up handlers in Python, which will look something like the following:

<pre><code class="python" id="python_handler">from ipykernel.comm import Comm
self.comm = Comm(target_name = YOUR_COMM_NAME)
self.comm.on_msg(msg_handler)
self.comm.send(your_msg_obj)
def msg_handler(msg):
 # your object from JS will be in msg["content"]["data"]
 # you should write code that changes the python state here</code></pre>

🎉 With these two code snippets, you have set up the most critical parts of your software! 🎉

## Coordinating State

Since both code and the UI could change the state of the UI in JavaScript, the state in Python (or R, etc.). There are at least two issues that you need to address. The first is when a user refreshes a page. You need to store the Javascript state somewhere so that when the page loads, the content is still there.
Second is when the kernel restarts, you need to make sure that the content is now reflecting the fact that the kernel is in a blank state.

Most of this coordination logic is application logic specific. However, a general strategy could be designed based on a database recover strategy---log replay. When there are sequences of events done on the UI side, log them and store in a more persistent state (e.g., in the Python kernel) for replay.

Another subtle issue is that the communication object changes when you restart the kernel, and you need to refresh your browser-side object as well. There may be an elegant way to address this in the notebook, but at least for Jupyter, we can into some specific problems that the [official doc](https://jupyter-notebook.readthedocs.io/en/stable/comms.html) does not mention. We describe the issue and solution below, which might save you a day of work.

<div class="collapse show">
 
Here are some "quirks" around the Jupyter Notebook when it comes to the creation and destruction of the comm object. In Jupyter Notebook, either the front-end or the kernel can register or open the comm, but the comm must be registered first. You can register the comm in multiple locations---the side that opens the comm will send to all that opened it, and all the registered places can send to the sides that opened it. However, if you try to register a comm that has already been opened, it will not receive messages---this causes the error `Comm promise not found for a_comm_id.`

Once you understand this behavior, you can now design a range of workarounds. The specific one we chose (with [Ryan's help](https://github.com/yifanwu/midas/pull/7/files)), is that using a special comm whose sole purpose is for recovery. If we detect that the kernel has changed, we will send a message via the recovery comm for the Python kernel to restart. The two snippets below show more details.

<pre><code language="javascript">function load_ipython_extension() {
  Jupyter.notebook.events.on("kernel_connected.Kernel", function() {
  tearDownMidasComponent();
});

LogSteps("Kernel starting, opening recovery comm");
function checkIfNull() {
  if (Jupyter.notebook.kernel === null) {
    window.setTimeout(checkIfNull, 100);
  } else {
    const comm = Jupyter.notebook.kernel.comm_manager.new_comm(MIDAS_RECOVERY_COMM_NAME);
    comm.send({});
  }
}
 checkIfNull();
}</code></pre>

Then in the python, the comm should be reset and the recovery of the Javascript state set.

<pre><code language=python>@comm.on_msg // you can also just call the function directly
def _recv(msg):
 debug_log("Received recovery request. Reopening comm...")
 // reset comm
 // recover state</code></pre>

</div>

## Persisting State

A notebook is not only an exploration tool but also a recording tool. Some tools persist the UI level information in the cell meta-data, such as [code folding](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/tree/master/src/jupyter_contrib_nbextensions/nbextensions/codefolding). A similar alternative is to store the data to your format and then reload from it.

A very different strategy is to "serialize" the state in code, which can be as simple as encoding the actions in some code APIs, or as complex as using the array of bi-directional programming techniques.

## UI Affordances of the Notebook

There are many ways to modify the UI of the notebook beyond creating a widget that fits the cell output area.
The first is a **dashboard** instead of modifying the cell outputs.
Another is **cell manipulation**, where you can create and modify cells, and perhaps even keep track of them.
Below we give some concrete examples and code snippets for these UI changes.

<div class="collapse show">

**Dashboard** If you work with JupyterLab, you can directly access special widgets like `MainAreaWidget` (example: [this tutorial](https://jupyterlab.readthedocs.io/en/stable/developer/extension_tutorial.html#extension-tutorial). When working Jupyter Notebooks, you have to get a little more creative. Consider the snippet below, which is how I instrumented a "dashboard" area to the right side of the notebook. In the snippet, I rely on the internal implementation of the Jupyter notebook, where `notebook` is the ID of the notebook div. It's, of course, not great that I'm relying on this, but for a research prototype, this hacky approach meets my needs.

<pre><code>const aDiv = $("&lt;div id="+yourID+"/&gt;");
$("#notebook").append(aDiv);
// then later you create the React component
ReactDOM.render(&lt;YouComponent/&gt;, document.getElementById("yourID"))</code></pre>


If you want an example of cell manipulation, a great example of complex cell manipulation in JupyterLab is [Gather](https://github.com/microsoft/gather). Concretely, for Jupyter notebooks, you can manipulate these like the following.

<pre>
 <code class="javascript">c = Jupyter.notebook.insert_cell_above("code");
 c.set_text("boo = 1");</code>
 </pre>
</div>

## Gluing Everything Together


Lastly, we need to tell the notebook to be aware of the extension. Then the notebook can serve the Javascript files, which will run the set up to create the communication layer for your application. This process is course different across platforms. In the next paragraph, I discuss how to for Jupyter Notebook.

<div class="collapse show">

Specifically for Jupyter Notebook, the [official doc](https://jupyter-notebook.readthedocs.io/en/stable/examples/Notebook/Distributing%20Jupyter%20Extensions%20as%20Python%20Packages.html) and example implementations like that in are both excellent references.

</div>

## Picking a Platform

When choosing what platform to implement/extend your tools to, we should consider both the audience and the engineering requirements. For data scientists, the options would be either Jupyter Notebook or JupyterLab, given that the Jupyter ecosystem has the most number of existing users. To compare, JupyterLab, as a second-generation python notebook, is much more ambitious than Jupyter Notebooks. JupyterLab is feature-rich with an opinionated framework and set of accompanying APIs. The main framework, [Phosphors](https://github.com/phosphorjs/phosphor), is sophisticated and seems to be similar to mobile app frameworks and indirectly, React, and the like. However, my issue trying out making a complex JupyterLab extension was that the documentation was very sparse, which requires reading a lot of source code and digging around other repositories (such as [Verdant](https://github.com/mkery/Verdant) and [Gather](https://github.com/microsoft/gather). Working with Jupyter, on the other hand, is a lot scrappier. Chose Jupyter if you have a preferred stack (for me, Typescript w/ React) because you can do a simple initial "hack" and then use everything you have as is, and also make sure that you can share most of your code.

That's all I have for now. If you have comments or corrections, please let me know!
