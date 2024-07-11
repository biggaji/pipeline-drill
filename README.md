# pipeline-drill

The project is a simple pipeline workflow engine. It uses a chained step list flow.

Below is a sample image of what I mean, just for you to get an idea. I plan to implement a simple UI to show
pipeline workflow in real-time, in the near future.

![Sample UI showig what the flow is like](https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-h_8oGh3HY5TZ2bfRAaPN4pl5PDYEmFFahQ&usqp=CAU)

<b>NOTE</b>: <i>Image was picked off the net</i>.

Learn me explain the process:

There is a pipeline service class that manages the lifecycle of a pipeline, (i.e creating, starting,
restarting e.t.c), then there is also a steps registry which is an object that is used to map step names to
their corresponding executing function.

I will update this docs again soon.

## Prerequisites

Make sure you have Node.js and npm (or yarn) installed.

### Get started

1. Clone the repository:

   ```sh
   git clone https://github.com/biggaji/pipeline-drill.git
   cd pipeline-drill
   ```

2. Install the dependencies:

   ```sh
   # Using npm:
   npm install

   # Using yarn
   yarn install
   ```

3. Compile the Typescript code to Javascript:

   ```sh
   # Using npm:
   npm run compile

   # Using yarn
   yarn compile
   ```

4. Run the application:

   ```sh
   # Using npm:
   npm start

   # Using yarn
   yarn start
   ```

Technologies used:

- BullMQ for queue.
- MongoDB for database.
- Redis inconjuction with BullMQ

Thank you for sticking around.
