import React from 'react'
import { Container, Divider } from 'semantic-ui-react'

const ContainerExampleAlignment = () => (
  <div>
    <Container textAlign='justified' style={{ marginTop: '7em' }}>
      <b>Research</b>
      <Divider />
      <p>
        dPanc is a tool to assist you in understanding as well as combating your diabetes.
        We wanted to be able to accelerate the process of getting analysis that would really benefit the everyday user of these blood-glucose monitors. As just tracking these numbers really is not enough in order to sustain a good health. One of our developers, has been trying to really understand which metrics we should focus on, and this developer has been our driver in understanding the metrics that are of value as our colleague who also has T1 diabetes who better to lead the charge?
      </p>
      <p>
        Looking over medical records, we realized that doctors only provide linear formulas that do not really allow one to know about their daily health. Our developer found a specific metric called the Time Weighted Average which takes your daily blood glucose measurement adds them up and divides it to get the average, but we found that given gaps in data (i.e. when a diabetic is in a period of rest--sleep) we would need to give an emphasis on certain time to get better averages as well as decrease gaps in data. Now, we would require the past 30 days worth of data in order to perform accurate analysis of the data, and we would like that consumers of our service attempt to upload their data as frequently as possible. Now, why the time weighted average over traditional averages? Well, it’s mainly to address the issue that certain blood sugar values should be weighed more heavily such as when you wake up the value prior to and after waking up than blood glucose values that are closer together. Mathematically, we are looking at the y-intercepts to measure the slope  as well as averaging out these slopes which is essentially looking for the trend and seeing where the trend changes as well as by how much.
      </p>
      <p>
        Blood sugar and physics class element of position where your blood glucose is like a soccer ball being kicked and the ball (blood glucose) will change over time and the speed of both the soccer ball and blood glucose fluctuate and performing vector-driven physics on blood glucose gives us another metric that diabetics can use to assess their health as well as check direct impact for their personal health.
      </p>
      <p>
        We are working towards an artificial pancreas system (APS) which is a piece of software that aids type one diabetics in making strategic decisions to manage their blood glucose levels. There are primarily two classification of systems: open loop systems, and closed loop systems. The former provides recommendations for actions the diabetic should take, while the latter utilizes medical hardware to automatically administer most of these actions for the diabetic.
        There are currently a few organizations doing human trials testing of a closed loop system, in an attempt to certify it as an FDA approved medical treatment. There are also dozens of reported type one diabetics who have “hacked” their approved medical hardware to construct their own closed loop system. In both cases, the subjects have found enormous success in maintaining healthy blood glucose levels, while reporting lower anxiety related to diabetes management. Barring a sudden biological cure to type one diabetes, we strongly feel closed loop systems are the future of diabetes management. However, we feel there are also two major downsides to this solution: the process of getting closed loop systems approved by the FDA is extremely slow, and the hardware required for a closed loop system would require significant financial investment for most diabetics. Because of this, it will still be a few years before this kind of treatment is on the market, and even then it will only be available for a small subset of diabetics. For these reasons, I think it is worth investing in an open loop system as an immediate and accessible solution.
      </p>
      <p>
       One of the primary functions of a healthy pancreas is to produce insulin. However, the pancreas also operates an extremely sophisticated system that produces a calculated amount of insulin to keep glucose levels in check. Unfortunately, the pancreas of a type one diabetic cannot do either of these things.

       Another common name for this disease is “insulin dependent diabetes”, which means a diabetic needs to take external insulin in order to regulate their glucose levels. It seems that a lot of people understand type one diabetes to be treated by simply taking insulin shots, but
       unfortunately it is not that simple. As mentioned before, the pancreas loses its ability to calculate
       the precise amount of insulin that is needed, and thus this task is passed on to the diabetic.
       Although there are a variety of techniques that are used to make these calculations, there are
       simply too many variables and margins of error to do this effectively time after time (with the
       exception of a few extreme treatment options, such as a ketogenic diet).

       This is the aspect where artificial pancreas systems will become pivotal instruments. They will utilize a library of algorithms and a variety of data sources (specific to the individual patient) in order to make calculated decisions for managing diabetes. Not only will these systems improve the overall health of diabetics by maintain healthy glucose levels, but they will also alleviate the substantial burden of 24/7 decision making that is required to manage this chronic condition.
      </p>
      <p>
        People want their data to be secure and retain autonomy of their data, and Blockchain allows us to do so. By tokenizing their data, users would be in control of who would receive their data and essentially set the value for their data if they wanted to monetize it as well as decide if they wish to share it with companies which are performing routine tests on this type of data to improve drugs and other tools being developed for diabetics. Having the data on the blockchain makes it immutable, and we are also able to increase security and trust for Type 1 diabetics while also empowering them with control over their data. Tokenization within the blockchain allows the users of our platform to have control over their data, and incentives regular contribution increasing.
      </p>
    </Container>
  </div>
)

export default ContainerExampleAlignment
