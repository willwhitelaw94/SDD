# New Recording 1982.m4a

**Meeting Date:** 6th Feb, 2026 - 1:28 PM

---

**Speaker 1** *[00:00]*: Here is should pull their default fees. Okay. 
**Speaker 2** *[00:03]*: And we do want that managed in portal because I haven't designed that. 
**Speaker 1** *[00:06]*: Yeah, yeah we do. Yeah. 
**Speaker 2** *[00:07]*: Okay. So it should be editable. 
**Speaker 1** *[00:10]*: Yeah. Eventually this is going to come from the lead and Jackie's going to know because someone fills a form in for a lead form and sometimes it comes from the coordinator already. So sometimes that will be pre filled. 
**Speaker 2** *[00:20]*: Okay. 
**Speaker 1** *[00:21]*: Obviously the fee is going to come from the coordination's default. Sometimes a core date is pre filled. Yeah. And same with the preferred management option. 
**Speaker 2** *[00:30]*: Yeah. 
**Speaker 1** *[00:30]*: So sometimes they're like oh I think I like sm. But then we have a lead to conversion form. It's a four step form. We've got. They've done a vibe through and it's on the HCA thing and in that they do that risk survey. Do you know the risk survey? It's like do you live alone? 
**Speaker 3** *[00:47]*: Do you do this, that AI manual questions. You upload the iit it takes some data points and then they ask them some questions like do live alone. Can you use technology? What's your favorite color? 
**Speaker 1** *[00:56]*: Yeah. 
**Speaker 3** *[00:57]*: Then it then it punches out risk profile which is you free to onboard self managed. Need coordination or no. 
**Speaker 2** *[01:05]*: Okay. 
**Speaker 3** *[01:13]*: Go to lead to HCA lth context. It's got onboarding flow, current state. 
**Speaker 1** *[01:19]*: I've got a drawing of it I showed you guys earlier. We now have this requirement that the agreement has multiple classifications on it. 
**Speaker 2** *[02:03]*: Yep. 
**Speaker 1** *[02:04]*: Okay, so we need to like if this is your form here, citing, read it on left editable and whatnot on the form. Yeah, we need to see a list of each of the classifications in like a form repeater or something. You know like it is just saying like 1, 2, 3 and if they go and view it we can. We're then linking the ACER status to a one to many relationship called classification on the agreement. So the agreement can have two classifications. We've decided that there's a date on that too which it will adopt from the agreement date. Okay. 
**Speaker 2** *[02:41]*: Yep. 
**Speaker 1** *[02:42]*: Entry and exit date. Because say you get ATHM later. The one thing here is on the agreement you say which classifications the default is all. 
**Speaker 2** *[02:54]*: Okay. 
**Speaker 1** *[02:55]*: So you agree that whenever that classification becomes a thing that you've agreed to all of them. Okay. 
**Speaker 2** *[03:01]*: Yeah. 
**Speaker 1** *[03:01]*: But then later you lodge for resto care. You don't need to re sign the agreement because we signed in all classifications. 
**Speaker 3** *[03:07]*: Yeah. Commencement date will differ though. 
**Speaker 1** *[03:09]*: But if someone went and read the agreement you could still see what is currently active. Potentially you can see that it's lodged. Okay. Not lodged. 
**Speaker 2** *[03:19]*: So at this stage would they ever be unmarking any classifications? 
**Speaker 1** *[03:22]*: Maybe. Maybe. 
**Speaker 3** *[03:24]*: Yeah. They could conceivably not say no, I. 
**Speaker 1** *[03:26]*: Don'T want you to use you for restorative care. But the default is for everything. It's edge case. 
**Speaker 3** *[03:30]*: Yeah. 
**Speaker 2** *[03:31]*: Okay. 
**Speaker 1** *[03:33]*: And then I would use that or even in the. All the classifications. You know, we show that in the sidebar anyway because the. Those classifications end up in the funding stream anyway. So what is. And then it should always be one to one. What is in the agreement? The classifications. That triggers the Acer lodgement. And then that night at midnight clock starts. 
**Speaker 3** *[03:52]*: Midnight. 
**Speaker 1** *[03:53]*: The guys have a thing that goes and pulls all those classifications. 
**Speaker 3** *[03:57]*: You're right. You're not gonna. Your commencement dates aren't going to be the same if you are awaiting like the. 
**Speaker 1** *[04:05]*: The commencement date is the agreement. Commencement date. 
**Speaker 3** *[04:08]*: Yeah. 
**Speaker 1** *[04:09]*: We will default the entry date to be the commencement date. But if. If that hasn't started yet, obviously that will have a different entry date to the agreement. Entry date. Yeah. 
**Speaker 3** *[04:20]*: Yeah. 
**Speaker 1** *[04:20]*: Okay. 
**Speaker 2** *[04:20]*: Yeah. 
**Speaker 1** *[04:21]*: So there's a way to see your classification like entry exit, which is actually when it became available. And that's why that has time stamps as well. But then there is the time that you created the agreement. 
**Speaker 2** *[04:33]*: Yeah. Okay. 
**Speaker 1** *[04:34]*: So that has like the classification type, the dates on it. I thought that would be good to just see the lodged at date, which is the entry date. Essentially it would be the same day. And if it was ended or something there. Yeah. 
**Speaker 3** *[04:51]*: The entry date's not the same as the lodge date. It could be. Could have, could have. 
**Speaker 1** *[04:57]*: Yeah. Something. I mean we. Let's say that we do this poll every night on every package. It could potentially be different. Yeah. We would generally say it became available. Entry. 
**Speaker 3** *[05:06]*: Yes. Became available. Let's just say it in basic. In English. So there's the. 
**Speaker 1** *[05:10]*: Okay. Yeah. Lodged out is different. 
**Speaker 3** *[05:12]*: Yeah. 
**Speaker 1** *[05:13]*: Available. And we didn't lodge it on the same. 
**Speaker 3** *[05:14]*: That's became available. 
**Speaker 1** *[05:17]*: Launched. Yeah. Became available with the entry date. Yeah. 
**Speaker 2** *[05:20]*: Anyway, entry date is available date. 
**Speaker 1** *[05:23]*: But you also. 
**Speaker 3** *[05:24]*: Yeah, yeah. And then there's the date that it's. Sorry. The date that we know that became aware of it. 
**Speaker 1** *[05:28]*: Right. 
**Speaker 3** *[05:29]*: That, that we know that it's. That it's in a stage at the moment of awaiting assignment or whatever the it's called. 
**Speaker 2** *[05:34]*: Yeah. 
**Speaker 3** *[05:34]*: Then there's the date that it's available. Then it's the date we lodged. Then it's the date it's terminated or expired. That's four. 
**Speaker 1** *[05:41]*: Yeah, yeah. 
**Speaker 3** *[05:42]*: So those are. That's. And we also, the care partners need to be able to know if it's in that first state when it enters the second state as it's going along. So they can action it and budget for it and shit. 
**Speaker 1** *[05:53]*: So classifications. Then there's a. It doesn't need a big design. This is where one person, his name's Brennan, he lives over it in the care team, in the accounts team. He goes through and lodges every single Acer entry manually. But Tim's going to investigate the API to just do it automatically. It's called the entry record there. So he won't need to do that anymore. Yeah, the clinical team, we have this ability to trigger from draft to set. Right. We've had a conversation about that. 
**Speaker 2** *[06:26]*: Yeah. 
**Speaker 1** *[06:27]*: Jackie by default should be able to. If we leave our risk survey in our Vibe app. 
**Speaker 3** *[06:33]*: It you. 
**Speaker 1** *[06:33]*: You've seen that survey. 
**Speaker 2** *[06:34]*: I will have another look. I think I have briefly. 
**Speaker 1** *[06:37]*: Eventually our lead to HCA process will have like the survey in it and it'll not allow her to go sent it or don't sent it but we just need to police that. She can send it or she can't because they have a different chrome browser where they go and do the survey and captures that state, you know, and then that just has to equal that. So cheap solutions just to create a toggle or like a way to say draft or send or something, you know. 
**Speaker 2** *[07:02]*: Yeah. 
**Speaker 1** *[07:05]*: But then in the future we build the full four step process which you know, you've seen the lead change. 
**Speaker 2** *[07:11]*: Yeah, yeah. 
**Speaker 1** *[07:12]*: Okay. 
**Speaker 2** *[07:14]*: Because currently when we update it from a draft we just say convert. But do we ever need to convert it back to a draft stage? Is that when you're making amendments to any of these details? 
**Speaker 1** *[07:24]*: No, I think we have drafts send, sent or amended. Because amended is just something that doesn't need to go back to drafting amendment, it just goes to amended with that. You have to sign it, which is. 
**Speaker 2** *[07:35]*: Not technically a draft until. 
**Speaker 1** *[07:37]*: No, it's not a draft anymore. It's sent, it's recent. 
**Speaker 2** *[07:39]*: Yeah. Okay. 
**Speaker 1** *[07:40]*: It's like reset. 
**Speaker 2** *[07:40]*: Yeah. 
**Speaker 1** *[07:41]*: It's a reset to them with an amendment. 
**Speaker 2** *[07:43]*: Yeah, yeah. 
**Speaker 1** *[07:44]*: And then they just sign the amendment. So I don't think you need to draft an amendment and sign an amendment to be honest. Maybe there's another draft stage, I don't know. 
**Speaker 2** *[07:51]*: Yeah. 
**Speaker 1** *[07:52]*: But like sent an amended of the same thing. So it requires action by then. 
**Speaker 2** *[07:56]*: Yeah. 
**Speaker 1** *[07:56]*: And then terminated. We need to build the termination flow. Main thing here is home care agreement and fees is something that lives on the home care agreement as well. 
**Speaker 2** *[08:06]*: Yeah. 
**Speaker 1** *[08:06]*: Matt's Got an issue with the way that the fees. If you change a home care agreement free fee from self to self managed plus obviously it should have an impact on the budget. What does that workflow look like? 
**Speaker 2** *[08:18]*: Yeah. 
**Speaker 3** *[08:19]*: And why aren't we just having an amendment? 
**Speaker 1** *[08:21]*: I think there's going to be something here which says like does it go into overspend? Yes. Workflow. 
**Speaker 3** *[08:33]*: No. 
**Speaker 1** *[08:33]*: Yes. Workflow for management. No. Does that send a budget into draft Again, no. Tick updates the plan budget and send. You know Bruce asked that this morning. Yeah. 
**Speaker 3** *[08:49]*: They there's a requirement that you need to them to sign off on the new budget with the management change. 
**Speaker 1** *[09:00]*: So they get sent an amendment with the budget attached to it. That's what Bruce was saying. 
**Speaker 3** *[09:04]*: Yeah. 
**Speaker 1** *[09:04]*: Who made that? Did we make that requirement? 
**Speaker 3** *[09:06]*: Aaron told me that age to go. 
**Speaker 1** *[09:11]*: Which is why I think if you. 
**Speaker 2** *[09:12]*: Go create another draft budget which is. 
**Speaker 3** *[09:14]*: Ridiculous we'll just download it. 
**Speaker 1** *[09:15]*: Yeah. 
**Speaker 3** *[09:16]*: But you meant to get an accurate. 
**Speaker 1** *[09:17]*: The one email template that goes out. 
**Speaker 3** *[09:19]*: You need an accurate idea about the total costs that you're comparing should you change it. So what are you going to base that on? Like if I've got. If I'm getting self managed plus because I don't not organizing services what am I going to base the estimate on? 
**Speaker 1** *[09:35]*: Sorry, one more time. 
**Speaker 3** *[09:36]*: So I'm self managed and I'm at it. That's why I'm getting self management plus. 
**Speaker 1** *[09:40]*: Yeah. 
**Speaker 3** *[09:41]*: Now my coordinator who top loads their work that's what their job is to organize the services isn't going to be able to tell me how much this is all going to cost because they haven't done that work yet. Unless they do have to do that which sucks. 
**Speaker 1** *[09:52]*: Yeah. Yeah. Okay well we need to. I'm just gonna make workflow question mark. Okay. 
**Speaker 2** *[09:57]*: Yeah. 
**Speaker 1** *[09:58]*: But what I just want to nail because Tim's going to go and build. It's just the multiple classifications and the management option change are the main two things we need to obviously have that trigger for sentence. So with this as well. Actually there's one more piece of this. Jackie's not allowed to proceed it. 
**Speaker 3** *[10:15]*: Right. 
**Speaker 1** *[10:15]*: Because it says hey it needs clinical intervention. I want to see an index or something. I won't tell you the UI of all the home care agreements that are in draft that requires intervention from clinical and then the clinical person if we're able to in the workflow which is the lead workflow upload an IAT then storing it to the file we then turn the IAT into draft needs and goals and risks. Right. 
**Speaker 3** *[10:44]*: I've got the numbers on that. By the way. Of the last 3,000 clients, 60 had went into required clinical information. 
**Speaker 1** *[10:50]*: So very little. 60 of those get held up over six months, three months probably. We did, yeah. So they were rejected. Called Project Fast Lane. Okay. Oh, that. So there's going to be lots that had to get looked at. 
**Speaker 3** *[11:02]*: Yeah. 60 were rejected and six of those were ones that passed the AI checklist but didn't get through the bouncer at the end of the door. 
**Speaker 1** *[11:10]*: So the bouncer being the clinical nurse upstairs, they get a workflow which is just like, have a look at this. But in our new wizard, once we get to it, we will have already uploaded the IoT that IIT has already an ability to turn to needs, goals, risks. So you're able to create the risks and then hopefully they might even go to the drafted risks or there might be some sort of AI analysis, like another little function after it to say like this is why you should or shouldn't take this person. It's like acceptance reasons or something. I don't know. The point is that they would tick that to say it's okay to sign now. 
**Speaker 2** *[11:46]*: Yeah. 
**Speaker 1** *[11:48]*: If it's okay to sign in the future, maybe that allows them to then go book the meeting. But at the moment, Jackie is booking the meeting for the following day because we only had 24 hours to book your meeting. There's people that are having meetings with care partners and the agreements aren't getting signed overall. And then the cat, then the assessment partner who does the meeting goes and says, okay, you can sign it. So they're like the gate. So we need to obviously get to that thing pretty quickly to beat the 24 hour time to book meeting. 
**Speaker 3** *[12:21]*: So there's extra logic based on that AI AIT thing that then says whether or not someone can sign the agreement immediately. 
**Speaker 1** *[12:30]*: Yeah, okay. 
**Speaker 3** *[12:31]*: But it's only signed on their behalf. We're still reserving the right to on board until we have the assessment. 
**Speaker 1** *[12:38]*: Yeah, yeah, okay. Yeah, yeah. Eventually, yeah. But that's the whole picture. That's lead to HCA and the HCA bit to that. The main bits of this bit and this bit, obviously this workflow to clinical and then what this bit does in amendment, when that goes to amendment and then the amendment gets signed as a workflow firm. 
**Speaker 3** *[13:00]*: You got all that? 
**Speaker 2** *[13:01]*: I didn't record that. 
**Speaker 3** *[13:03]*: No, I did. I recorded. 
