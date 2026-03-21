# mfs/lth

**Meeting Date:** 6th Feb, 2026 - 9:45 AM

---

**Room 403** *[00:00]*: Fireflies. Okay, so from that claims meeting, getting multi funding streams work functioning is top priority at the moment. We had a meeting the other week, it was very thorough. But I just want to see so what do we have at the moment? Because I do recall seeing some UI in that allows people to select multiple funding streams to add onboarding. Now that you mention it. So in Zoho they can select like just a single funding stream is what I understand. It's like the primary funding stream. So then there's a secondary pick list. But we're not doing any of that. Just. We're not doing anything with that just yet. No. Yeah, but then on Portal side we do support multiple like package classifications. So that's. 
**Room 403** *[00:52]*: But that's after we sync from Surf Australia we don't have anything that sort of takes multiple funding streams from Zoho yet and brings that into Portal. Okay. So that. So let's say that the sales is taught to actually utilize that second field. Yeah. And then so they need to be also capturing dates for each of those. The. The take up date. And we don't particularly need that take update in. 
**Romy Blacklaw** *[01:17]*: Oh no, we do. 
**Room 403** *[01:18]*: What? 
**Romy Blacklaw** *[01:19]*: Not for Portal but what I've discovered Matt is all of the ones that have had their funding withdrawn. The issue is we recorded an entry in Proda for those people. So it looks like we did all the right things. But we recorded the entry after the take up date, the expiry date and where in home. In home care package world that used to be fine. There was no issue with doing that. Funding would still be okay. What's happening in support at Homeworld is they're withdrawing that funding even though if we've recorded the entry if record it one day after the expiry take up date. That was rule of thunder. 
**Room 403** *[01:56]*: Okay, I'm just going to check if we actually store the take update on. 
**Romy Blacklaw** *[02:01]*: I don't think it's relevant for you. I don't think it's relevant for you guys. That's just capture thing because it is important for the sales to be noting what the expiry date of each of the funding streams is and we need to record that in CRM. But also Tim, if we do move to the lead to HCA piece that's kind of relevant for that as well. I guess. 
**Room 403** *[02:29]*: I'm wondering if the solution instead of having just two pick lists in Zoho, whether we can just say select your like HD level or SAH level and then select your at level like have just like 4 or 5 pick lists. 
**Romy Blacklaw** *[02:45]*: But they might not ever have. They might not. 
**Room 403** *[02:49]*: It just be set to null if they don't have it. 
**Romy Blacklaw** *[02:52]*: Okay. Yeah. 
**Room 403** *[02:53]*: And then we can just sync every single like field from Zoho into portal. 
**Romy Blacklaw** *[02:57]*: Yeah, that makes sense. 
**Room 403** *[02:59]*: Rather than having a single multi select, just have like a select your hat. Select your. So unless we have a sync back from the consumer care plan modules that would need to be probably captured at the push form level. Right. 
**Romy Blacklaw** *[03:19]*: Yeah. I can't talk to CRM very well. But. But what I would say I've got. 
**Room 403** *[03:24]*: Jackie coming in a couple of seconds. 
**Romy Blacklaw** *[03:30]*: That's onboarding. But I think that. And which is part of the problem. But the other problem is the once they've onboarded and then they get new packages. So for example I came across one yesterday who their funding withdrawn. Matt. They'd only been onboarded as a ATHM only client and they'd been assigned their ongoing package and we just didn't know and so no one had gone and recorded an entry for it. So that's the other big problem that we need to solve. 
**Room 403** *[04:02]*: Yeah. Okay. Because Services Australia does tell us the take up end date and I'm wondering if we can also just have some sort of tracker on that on our portal side to say you're approaching trackup end date. 
**Romy Blacklaw** *[04:13]*: Yeah, I've said to Mike, so I don't know how much you guys are aware but the CARE partners now get in teams. They get prompted if they haven't tagged a call or an email to say you have to tag or you have to tag this email or call or what was the tag meant to be? So I think whoever is like if it's sales should get a, a prompt in teams from one of these AI bots saying hey this expiry date's coming, you need to do something. 
**Room 403** *[04:47]*: Yeah, I'm just not sure are they mutual exclusive? So in Pro when you saw this one that hadn't been taken up, it was taken up a day later. Did it say that it was still allocated or did it have a status on it? 
**Romy Blacklaw** *[05:01]*: Yeah, so it had withdrawn on the funding stream and then some of them were reinstated and some weren't. Yeah. But I'm wondering, so you know how in the meeting we had last week we spoke about having a list view. Can, can we just add those when they have new funding that hasn't been. So the funding's approved but we have, but it's not. Not verified meaning we haven't recorded the entry in prota for it can we add that as a filter in the budgets inbox, like to. Or do we have to build a new list. 
**Room 403** *[05:39]*: So it has unverified funding that's not allocated yet? Is that sort of like you want. 
**Romy Blacklaw** *[05:46]*: Them to like that? That those cases where they're ATHM only and we haven't recorded the entry for their ongoing funding yet? You know about the funding in the API data, right? 
**Room 403** *[05:59]*: Yeah, I think so. I think we. Yeah, I just need to confirm if. 
**Romy Blacklaw** *[06:03]*: There is like allocated. It's allocated or something. 
**Room 403** *[06:07]*: Yeah, that query that I sent you yesterday. Yeah, yeah, yeah. I think you can get a filter for that in the inbox. 
**Romy Blacklaw** *[06:13]*: Yeah. Because Luke wants a daily report on these like allocated, but not. 
**Room 403** *[06:20]*: I'm just not sure how accurate is that query like list that I gave you the other day? Oh, yes, that from what you're seeing. 
**Romy Blacklaw** *[06:28]*: It'S accurate except for then we had to go and add an additional. Has the funding been reinstated? 
**Room 403** *[06:35]*: Yeah. Okay. Has the funding been revamped? All right, what about notifications? So if you can poll that. Let's assume that you can. It's perfect. How the notifications, it would be a notification to be sort of like a tab on the inbox page. So there's this inbox table where people could find at risk budgets. And so I think there just be another tab on there that shows this client has been allocated the funding, but it hasn't actually been verified by Surfers Australia yet. So it's like allocated but not existing on Surface Australia. So client. 
**Romy Blacklaw** *[07:10]*: Client has new funding. New funding. 
**Room 403** *[07:13]*: Yeah, yeah. Available or something. So I've got ongoing and I've got. And I've got, I don't know, ATHM unverified at onboarding. Okay. When you're polling it and then all of a sudden it's allocated. How do I find out? 
**Romy Blacklaw** *[07:35]*: No, so that's not a good example because that wouldn't happen. ATHM is always so. 
**Room 403** *[07:44]*: Sorry. All right. One of the other ones. 
**Romy Blacklaw** *[07:50]*: So you would reverse that. You onboarded as an ATHM only client. So you onboarded us with at high and then you had no ongoing. So. But what. So what we would see is that ongoing was. Then Matt would say through the API, I think that O became allocated. 
**Room 403** *[08:09]*: Right? Yeah. Okay, cool. So allocated but not like entered via Proto or something like that. 
**Romy Blacklaw** *[08:14]*: Yes, yeah, okay. 
**Room 403** *[08:17]*: We can do that by the API. You can. How do I care partner? How do I know? Well, at the moment you don't know as a care partner. And that's why we're building this Inbox page. It's the inbox page. Yeah. So the inbox as a care partner shows sort of like it just is filtered to their packages that they manage and they can at the moment they can filter by app. I never look at that page. So how do I. 
**Romy Blacklaw** *[08:37]*: Know that it look at that page? They do. 
**Room 403** *[08:42]*: Yeah, they do. If I sense anything that has an exclamation mark and pops out at the screen in my day to day. No, because the notifications, I, I look at them on people's laptops, they have 99 plus on there and I go. 
**Romy Blacklaw** *[08:53]*: Okay, but that's like one 99. 
**Room 403** *[08:55]*: Yeah, thousands. I'd like to know like there is another. We could digress into that. It's not because it's like can you not click read all on it? That doesn't work. 
**Romy Blacklaw** *[09:07]*: Well, that's my task. That's where tasks comes in. 
**Room 403** *[09:09]*: Right. 
**Romy Blacklaw** *[09:10]*: Like you need to be say something high priority. 
**Room 403** *[09:12]*: People are just going to have a thousand tasks and they play I don't. 
**Romy Blacklaw** *[09:15]*: Care then that becomes workforce management. Right. Like if my team member has 10 high priority tasks which are not actioned, then I'm fucking on them. Sorry, that's like. 
**Room 403** *[09:27]*: All right, okay. Can I get an email? You can get an email, but that's the same deal. Like it will go there inbox and. Okay, all right. Instead of saying like a permanency by saying we need some sort of flag to pop up whether or not that's an issue. But is it part of their day, Romney, that they're looking at these inboxes at the start of their morning or something. 
**Romy Blacklaw** *[09:47]*: It is a big part of the day. So if we think about clients, for example, our care partners, for example, that work with external coordinators, that's where they look for their budget submitted by external coordinators and then they all this is where it's part of their composable workday that they're dealing with budget at risk budgets. And so they do, they actually do use this page every day. 
**Room 403** *[10:11]*: What's like the inbox thing that was closed off. 
**Romy Blacklaw** *[10:15]*: So like notification comes in. What's like the accountability flows off. Do they like if it just opens, that's probably not enough. How do we know it was actioned? Well, the status will change. Yeah, yeah. 
**Room 403** *[10:28]*: We'll then start seeing that funding stream appear on the client and then. But we're going to check on the nightly. I don't know if we can get them to manually poll it. Two Hours later. Because I think Romy, we found out it takes about two hours for the funding to appear. 
**Romy Blacklaw** *[10:41]*: Yeah, I'm just so worried about the two hours thing. Like that's only if we've got an urgent escalation or invoice that needs to be paid or something. We can sort that all out from a process point of view, but at the moment we just don't know. So Jackie, you missed earlier I was saying I did come across ones yesterday that have onboarded as ATHM only and we've missed the cutoff date for their ongoing because we just didn't know about it. Oh, we know they had ongoing services. Yeah. So they onboarded as ATHM only and then they were assigned. They were assigned their own. 
**Room 403** *[11:17]*: Can you find that from that spreadsheet that I sent you? 
**Romy Blacklaw** *[11:19]*: Yeah, I would miss that. Like we still would have had like it would be 56 days from. That does make sense anyway. Well, we didn't know. They didn't tell us. The client didn't tell us and no one was looking. 
**Room 403** *[11:34]*: We need to be able to onboard one any individual funding stream and many with all of their tech updates. 
**Romy Blacklaw** *[11:46]*: Jack, in the claims meeting this morning, we asked Erin about the agreement and she said just the standard agreement is fine for onboarding with many funding streams. Oh great, that's good. That's easier. 
**Room 403** *[12:00]*: Okay, so that's so. So where in the flow, was it in the lead module or was it in the push form where Tim's field appears where you can select that primary and then secondary funding streams? There's a short term pathway in Zoho CRM. Is that what we're talking about? Yeah, I know that it ends up there, but where is that caught? What is it? What do you. What does that first appear? 
**Romy Blacklaw** *[12:23]*: That's in the consumer module, but we don't use that. We use the HCP level. 
**Room 403** *[12:27]*: Okay, so we need to add some push form then. Yeah, I was just talking to Robbie about this. I think we can have like just four different fields that is selecting like the 80 level high. Level high. Like. 
**Romy Blacklaw** *[12:41]*: All the max they could ever have. Yeah, no six is the max that they can ever have. We have got a client like that. 
**Room 403** *[12:50]*: Does the, does the Zoho. I'm wondering, could we introduce a new tick list in Zoho CRM that's called classifications. Yes. That has all of them on there and is multi select. And then we educate everyone to start picking that one up. Remove the short term pathways one and for sure the HCP level Just works how it works currently and it's screwed. Right. But like it just means okay, it doesn't break anything. But if it's possible then to have that one classifications pick list that allows for a little bit of bespoke logic in there in Zoho CRM to kind of allow only one of the 80 ones to be selected in that list and only one of the home modifications ones to be clicked but then multiple of the others. I don't know if that kind of make it ugly and simpler. 
**Romy Blacklaw** *[13:47]*: What about you've got high at and you've got special assistance at? 
**Room 403** *[13:52]*: Okay, well okay, no, but that's what I mean that kind of. So we figure out the rules there for what can be selected with what. But it's one pick list in Zoho zero. But you need dates as well for those. So unless you wanted to. Unless you want to dynamically like populate these date fields, it might as well be what is the maximum number that anyone could have at any given time. 
**Romy Blacklaw** *[14:17]*: Well, can I just clarify one thing though. If we're talking about onboarding only, which I think we only need to because once they're onboarded we pick up their funding streams in. In portal anyway. But if we're talking about onboarding, I don't care about unspent funds. So let's remove CU and hc. We don't need to create a funding stream for them. Yeah, yeah but so if we're talking. If we remove them then you could have a case where a client has an ongoing level RCP at high home mods, high special assistance at. So they could have five. In reality they could also have CU and HCA so they could have seven. 
**Room 403** *[15:03]*: Sorry, I didn't even know what most of those acronyms are. Which of those was any of those representative of EOL and RESO Restorative Care. 
**Romy Blacklaw** *[15:13]*: So you, if you're EOL you will not have on at the same time. 
**Room 403** *[15:19]*: Okay, yeah, so I've got four fields in total. 
**Romy Blacklaw** *[15:25]*: Five. 
**Room 403** *[15:26]*: Yeah, there's five. Oh the special needs one five fields that could have max five stuff five that are relevant but okay, that means five and then breach for those five. It can be ugly as. Doesn't matter because we're going to make it pretty later. No, it's just. 
**Romy Blacklaw** *[15:44]*: I mean look, it's not a manual. They'll get over it's fine. 
**Room 403** *[15:47]*: But the Zoho module has a sandbox, right? 
**Romy Blacklaw** *[15:52]*: Yeah. 
**Room 403** *[15:53]*: Could we play around in. In there for who like hour? Like with all due respect, who cares about what it looks like in Zoho. I do. Because then it makes it easier from our perspective. Yeah, but would you want just a JSON blob of all the selected fields or would you want like individual fields that you could. Then I want to see how bespoke we can make the pick list in Zoho serum. 
**Romy Blacklaw** *[16:12]*: Yeah. One thing that we have to remember as well, for everything that we do, Bernie's team then also has to go and train 200 coordinators on how to. 
**Room 403** *[16:19]*: Do the same thing in Zoho CRM. 
**Romy Blacklaw** *[16:21]*: In the Zoho forms. So if we change HCP level to this idea of having this is your funding, here's your date. This is your funding, here's your date. We also have to go train 200 coordinators on how to refer a client following the same instructions. Yeah, okay. 
**Room 403** *[16:35]*: Which is. 
**Romy Blacklaw** *[16:35]*: That's fine. Just something to plan for because otherwise the forms will not go through to Zoho and we will not be getting client flow. 
**Room 403** *[16:42]*: What are we doing with the date field? 
**Romy Blacklaw** *[16:44]*: The date. There's only one day field. Oh, well, there's a lot of date fields. Well, no, so that's the problem is that when they have different take up dates, the different funding streams have different take up dates. And this is what we've uncovered this week is that the take up dates are extremely important. 
**Room 403** *[17:00]*: Okay. Yeah, but Portal doesn't need to know those take updates. 
**Romy Blacklaw** *[17:05]*: Because Portal won't know about them until one of the funding streams is like, sorry, we won't get anything through API until one of the funding streams entry is recorded. But we, what we need to get to is recording all of the entries in prota for all of the funding streams before the take update. 
**Room 403** *[17:26]*: Okay. All right. Just to bring it all back, we need to be capturing every possibility. And the, and the way of capturing and onboarding also needs to preclude the combinations that can't exist. Okay, so that's just fields and then values. Right. So there's five, I'm guessing that's the max. If it means that we've just got. We've got five, we've got 15 extra fields because every one of them has two like a start, like a commencement date and a take update. Right. So if they've already, if the start dates already happened, is that even possible? I don't know. 
**Romy Blacklaw** *[18:01]*: Sorry. So when you think about the consumer modules out of fields, we can't have them in the fields. 
**Room 403** *[18:06]*: Okay, we'll do it in the push form, we'll add it. 
**Romy Blacklaw** *[18:08]*: That that is. Oh, can we remove any. 
**Room 403** *[18:12]*: Can we remember we should. 
**Romy Blacklaw** *[18:13]*: That's an error. That's an Aaron and Ox question to make sure it's all good to do. So ultimately yes, probably we can call some. Can we cull 10? I don't know. 
**Room 403** *[18:23]*: So wouldn't that be. Can we call the sub one that we've added? 
**Romy Blacklaw** *[18:27]*: What's the sub one? Can we use. Can. Can we use. So you know how we've created this new funding and services module. Can we use that instead? No idea. 
**Room 403** *[18:40]*: In short, that doesn't have any integration with Portal yet. 
**Romy Blacklaw** *[18:44]*: Care Plan has heaps of integrations with Portal. Why can't we use Care Plan? So push form when we do the multiples, can we. Instead of having all AS fields, can we make more care plans? 
**Room 403** *[18:52]*: Does the consumer want one have more. More like. Because this one's got a short term part pathway. Remove that one. I'll build. I'll figure out a way to build a classifications. How many? 14 more. Just a single one. I reckon there's got to be a way in Zoho to build custom pick lists. No, not dynamically. 
**Romy Blacklaw** *[19:17]*: Trust me, every time I try it's like JavaScript. 
**Room 403** *[19:20]*: Yeah. 
**Romy Blacklaw** *[19:20]*: Go write your client JavaScript. 
**Room 403** *[19:21]*: Yeah. We can, we could. Don't underestimate the limitations. Hang on, we can do that. We could write a bit of custom JavaScript and it would be a lot less effort I think and we'll get all the rules into the JavaScript and then it'll just show up here, a little bit of code and then it'll be classifications. Okay. 
**Romy Blacklaw** *[19:36]*: I haven't tried it before. 
**Room 403** *[19:37]*: I promises I don't mind as long as we can get all that stuff there. So where. If you can show me where that is, where it asks you for JavaScript for a pick list. Probably can. Then then I can go with Matt and we can. Then. Then we just need to work out the rule logic that we need to put into the JavaScript. 
**Romy Blacklaw** *[19:54]*: I think I'd be getting to sense check all of that with Aaron just as like the ultimate understands our CRM and the consumer module before we do any. 
**Room 403** *[20:04]*: Well, we've got the sandbox environment. Yep. And we could. I could start playing around on there. 
**Romy Blacklaw** *[20:11]*: Okay. 
**Room 403** *[20:11]*: And if let's say okay, I spend today investigating that with. With Lachlan and then if we come back and it's not possible. It's too hard. Right. Why. Why are we. Why like let's assume that we can find the real estate in the consumer module. Why would we spend any effort whatsoever Trying to make this look more. 
**Romy Blacklaw** *[20:33]*: Look better so that it's accurate and the data is clean. 
**Room 403** *[20:38]*: We can do that with just the fields. Can we just. Like. 
**Romy Blacklaw** *[20:41]*: Like ultimately, yes. There's some anomalies. Do I think that we're going to get them regularly? 
**Room 403** *[20:46]*: No. 
**Romy Blacklaw** *[20:46]*: Is there any like, right now? Would we be comfortable just like sales mates of Whoopsie. We just fix it up at Assessment. Like I don't think that we're going to have that many that come through where it's like, no, they can't possibly have ongoing and end of life at the same time sales that up. Like we could probably before writing JavaScript and making things complicated. Just. 
**Room 403** *[21:03]*: Yeah, I actually think it's not complicated. I think what's more complicated is unraveling unvalidated data from Zoho coming through and then being in a mess in. On Portal side where we're looking at Zoho CRM like, oh wow, there's six different values here. Which one's actually. And then. And then. And then we. We're in a like a decision paralysis from Portal's perspective because we don't actually know. Yeah. 
**Romy Blacklaw** *[21:27]*: Which one know Assessment. 
**Room 403** *[21:30]*: Won't we just. 
**Romy Blacklaw** *[21:32]*: They'll take it at face value. And we're also moving to assessment. Sending the budget. So potentially we're sending the budget before we've verified anything. So we do want to just make sure that it. 
**Room 403** *[21:44]*: That's. That's. They'll need to have the budget made again once it becomes. Once it becomes active though, right? 
**Romy Blacklaw** *[21:53]*: No. 
**Room 403** *[21:57]*: All right, so okay. To bring it all back. All right, let's assume we've fixed that we've captured everything we need to capture at onboarding. Then we need to be able to know that it's been updated. The status, I mean of it. By calling the API. You need to be able to delete. Sorry, terminate one and not the others. And we also need to be able to assign care partners dynamically based on the rules that you said before Ronnie, about needing a clinical one. Thankfully, they don't need to be the same person, so that decomplicates it a little bit. But basically if they've got. 
**Romy Blacklaw** *[22:33]*: They'll likely never be the same person. 
**Room 403** *[22:36]*: Yes. 
**Romy Blacklaw** *[22:37]*: Restorative. Restorative care is the edge case. That's it. 
**Room 403** *[22:41]*: They have restorative care that they needed another care partner for that clinical one. A different one. Yeah. And they also need to be. And they also need to be on. Or two of them, I believe. 
**Romy Blacklaw** *[22:54]*: Rummy. 
**Room 403** *[22:54]*: They need to also be on fully coordinated. The only Option. So you need portal to support multiple care partners. But like they're a clinical care partner. I think they're like multiple care partners for different funding streams. Good, lovely. 
**Romy Blacklaw** *[23:07]*: Restorative. It's only applicable to restorative care. 
**Room 403** *[23:12]*: Only applicable to restorative care. They've got restorative care. They need a clinical care partner in addition to their existing. The other one. 
**Romy Blacklaw** *[23:18]*: End of life. Not the case. Oh no. Because ongoing stops. 
**Room 403** *[23:22]*: So ideally would you want that to display next to the funding stream on the budget that hey, go talk like how's that going to feel look and. 
**Romy Blacklaw** *[23:30]*: Feel there in my mind the best place to. And I don't know if that would fit. Probably need to talk to design in the left hand menu where you've got care partner and you've got care coordinator. You could also have clinical care partner. 
**Room 403** *[23:46]*: Yeah. Okay. And there'd just be one of them. Not multiple. Yeah. 
**Romy Blacklaw** *[23:51]*: So you'd have care partner is Natalie Tom. Clinical care partner is Rebecca Eady. 
**Room 403** *[23:58]*: Yeah. Then I'm guessing you're going to want to mass assign these at a certain point. Yeah, yeah. They need to be auto assigned. How are they assigned at the moment? Okay. By the client. I have no idea. Summary Romney question for you? 
**Romy Blacklaw** *[24:15]*: I don't know. Yeah, no, sorry. In current process, how are we actually allocating a care partner who's doing it? The care team does it. It goes I think to Stephen who does it once or something. I don't know. 
**Room 403** *[24:35]*: Yeah, all right, well let's just. 
**Romy Blacklaw** *[24:39]*: But yeah the problem at the moment because as we rapidly grow, as we all know, as we rapidly grow, we have new pod leaders, etc all the time who can't don't have any visibility in portal over their team and there's no way to build that at the moment. And that's what Steve's doing. No, they're just, it's just there's no way. So like for example, Alex is an external pod leader and he has no. He can't see his team's at risk budgets because there's no way to mass reassign his care, his pod to him as a pod leader. Yeah. 
**Room 403** *[25:23]*: Right. 
**Romy Blacklaw** *[25:24]*: Okay, so just like impersonate all of his staff to see what they need. Can you impersonate. 
**Room 403** *[25:30]*: Wait, wait. Is that team management? 
**Romy Blacklaw** *[25:33]*: Yeah, team management. 
**Room 403** *[25:34]*: I think that that's going live on Tuesday first iteration of it which will let them at least observe the team members that they're responsible for and assign permissions to them as well. At some point I'd like To extend that to allow them to mass assign and mass unassigned packages. I think that's like the right place to put that kind of advice. 
**Romy Blacklaw** *[25:57]*: It'd be good to do a session on what we're planning there. 
**Room 403** *[26:02]*: Yeah, yeah. I've gone through. I was like wait, what's checking on Tuesday. 
**Romy Blacklaw** *[26:06]*: Yeah. What are you doing? Sorry Dave. Put us back on track. 
**Room 403** *[26:11]*: Yeah, sorry. Can we just to get back on track again like so this add a new care partner type for response, responsible for different funding streams. That. That's not happening like right now. Just the rest you need to be assigned a clinical care partner. 
**Romy Blacklaw** *[26:29]*: Yeah, but at the moment we don't list who at the moment we don't list the clinical care partner anywhere. For those people. We've only got. What have we got? We've got like a handful of medical care partners. 
**Room 403** *[26:41]*: Yeah. We don't have many residents. Do we capture the clinical care part. 
**Romy Blacklaw** *[26:44]*: And Zoho serum we captured. So the care partner is the care plan owner. But I don't know what a clinical care partner is. 
**Room 403** *[26:53]*: So. 
**Romy Blacklaw** *[26:53]*: But like in Zohar CRM, how we'll know who is the care partner is the care plan owner equals say Alex. Alex is the care partner. 
**Room 403** *[27:04]*: Could we just use the same field but because we know that every restorative care plan will have a clinical one. And if we're allocating care partners correctly. 
**Romy Blacklaw** *[27:15]*: It'S important because let's think about this. If a bill goes on hold and the bill is linked to a budget item which is linked to restorative care funding, that shouldn't go to the self managed care partner who knows nothing about the restorative care. It should go to the clinical care partner who is responsible for the restorative. 
**Room 403** *[27:35]*: Care package at the moment. No, I'm saying that's a longer initiative because right now we have a one to one. 
**Romy Blacklaw** *[27:44]*: Yes. 
**Room 403** *[27:45]*: And there's a lot of filtering that's already happening. Let's say on the inbox page for utilization of budget plans, for example, there's a filter that's just goes hey, what am I? My packages. And that at the moment relies on the one to one. And now we are suddenly going one to many. And that's complicated. I'm making something. 
**Romy Blacklaw** *[28:06]*: It is complicated. 
**Room 403** *[28:07]*: One to one is not easy. 
**Romy Blacklaw** *[28:12]*: Well, that's where we need to get to. 
**Room 403** *[28:15]*: Okay. Yeah. 
**Romy Blacklaw** *[28:17]*: Understand that's not how it works today. But. But we do need to get to that. 
**Room 403** *[28:21]*: Right. The management option is these. So you could have self managed for your Ongoing. And you need to have self managed plus for resto. And I'm going to say. I want to say end of life. Right, Romy? Right. 
**Romy Blacklaw** *[28:48]*: But you won't have self managed. Sorry, you won't have self managed ongoing at the same time as end of life, but you will for restorative care. 
**Room 403** *[28:59]*: Okay. All right. So you could have ongoing self managed and are so self managed plus. You'll need to have self managed plus in that case. So you could have two options running at the same time too. 
**Romy Blacklaw** *[29:12]*: Correct. Restorative care is the only. Only. Again, the only. 
**Room 403** *[29:15]*: Yeah. So when you select restorative care on a budget item, that's when we need to apply like a coordination fee. 
**Romy Blacklaw** *[29:23]*: Yes. 
**Room 403** *[29:23]*: However, ignoring the fact that it's self. 
**Romy Blacklaw** *[29:26]*: Managed, our coordination, although it is fully coordinated, we charge. Trilogy charges coordination on restorative care services. Okay. 
**Room 403** *[29:37]*: So that's not going to have any effect on. Hang on. 
**Romy Blacklaw** *[29:40]*: It is. It is. It actually has more of an effect on our fully coordinated clients because they will have an external coordinator for their ongoing services who does charge a coordination fee, but their restorative care has to be internally coordinated and we will charge 0% coordination their end of life. Does it need to be internally coordinated? And would the external coordinator charge a coordination fee for end of life? Yes. Sorry, no. Sorry. End of life. Yes. Yep. 
**Room 403** *[30:17]*: Yeah. Thank you. 
**Romy Blacklaw** *[30:17]*: I've got an Excel spreadsheet. 
**Room 403** *[30:20]*: That's cool. Does this. Does that have any impact on the agreement or is that all tied up in the one agreement? As Erin said, instances where I've got two different options going at the same. 
**Romy Blacklaw** *[30:33]*: Time would impact the agreement. 
**Room 403** *[30:35]*: Yeah. Are you sure? Can we just change this agreement? Say, hey, if there's only one option. Right. And if it's covering. 
**Romy Blacklaw** *[30:48]*: No, because your external, your package, your ongoing package can be whatever it wants to be or whatever we agree on. Right. It can be self managed or externally coordinated or internally coordinated. It can be one of those three things. But your restorative care is always going to be internally coordinated with a zero percent coordination fee. 
**Room 403** *[31:11]*: Yeah, yeah. I'll create an issue for that one. And Trilogy is always going to be zero coordination for restorative care services. 
**Romy Blacklaw** *[31:22]*: Correct. Correct. And end of life will always be. If Trilogy is the coordinator for end of life, we will always have a custom coordination of 10% for end of life. 
**Room 403** *[31:36]*: How are we saying that this service that is like coordinated by Trilogy or. 
**Romy Blacklaw** *[31:41]*: Someone else manager is Trilogy care compared to coordinator Will be. Yeah. 
**Room 403** *[31:47]*: Okay. Yeah. 
**Romy Blacklaw** *[31:50]*: That's very complicated. I know. I didn't design it. 
**Room 403** *[31:59]*: Okay. 
**Romy Blacklaw** *[32:00]*: That's what's been signed off by Luke, though. So that is what it is. 
**Room 403** *[32:04]*: Yeah, yeah, yeah. 
**Romy Blacklaw** *[32:13]*: From a Staniel's perspective, I guess. Jack. But to encourage internal coordination for end of life where we can. Yeah, I typically don't recommend external. It's part of my usual flow. 
**Room 403** *[32:32]*: All right. I think that sort of covers off. Oh, yeah. And being able to. I need to terminate one model and all of this. And all this needs to be very clear to Brennan. Also the lodging of whatnot. So they need to adjust their workflow to make sure that they're checking these dates that we've gotten and not lodging. I mean, I don't know what the situation is now. He's either doing nothing or he's doing everything incorrectly. So he needs to be able to lodge the correct aces, which he doesn't need. He doesn't need different referral codes for he. But he does need tcid, so that's fine. He will just. That'll just be a change in. In process for him. 
**Romy Blacklaw** *[33:24]*: It's not tcid. They're recipient ID from Services Australia. 
**Room 403** *[33:29]*: Okay, sorry, not tcid, recipient id. My bad. So he just needs those things and he can lodge. What's the process going to be for terminating a funding stream? Yeah, from Portal's perspective. 
**Romy Blacklaw** *[33:46]*: Someone. In order for us to terminate a funding stream, we also need to do the same thing in reverse. We need to log into Proger and record an exit in Proga, which will withdraw the funding in. That's what we'll see in the API. 
**Room 403** *[34:02]*: Would we be withdrawing? It'd just be end of life when the deceased. 
**Romy Blacklaw** *[34:07]*: Any of them, except for unspeakable. Yeah. 
**Room 403** *[34:14]*: Yeah, you could, but we need. 
**Romy Blacklaw** *[34:15]*: To almost be able to. So, like, you have to be able to close off individual streams and then once all of them are closed off, then terminate the client as a whole. 
**Room 403** *[34:25]*: Like. 
**Romy Blacklaw** *[34:25]*: Because we wouldn't want to terminate the client as a whole until all of their funding streams have been closed. Because otherwise, if I have ongoing funding, but I've closed both my AT and my I don't want it to be terminated as a client with Trilogy care. But your AT&might also expire before you need to. Like any of the short term pathways can expire. Right? Yes. 
**Room 403** *[34:46]*: Yes. 
**Romy Blacklaw** *[34:47]*: I still wouldn't want to be terminated as a client because my ongoing is still there. Because right now, for Brennan, like right now, we terminate a whole client to terminate anything which doesn't make any sense. 
**Room 403** *[34:58]*: Yeah, that's the. The Main constraint we can. We can factor in the expiries. But that's. That's the. That's the key issue at the moment is that we need to be able to terminate one and not the other. So what that looks like. So the termination at the current time is that the Care Partner is the one that's primarily actioning it, Right? Yeah. And then there's some sort of feedback to accounts. Sorry. To Brendan that he ultimately lodges that doesn't happen. 
**Romy Blacklaw** *[35:31]*: Yeah. Like, it only happens if the client's leaving Trilogy or like permanently. We. We have no process for. 
**Room 403** *[35:38]*: Yes, but that's where it currently works. So that similar. A similar process needs to happen for whichever ones. For these individual ones. 
**Romy Blacklaw** *[35:46]*: Yeah. So it needs to be like the funding. Closing up the funding. 
**Room 403** *[35:50]*: Okay, bring it. What does that look like in Portal though? Is that. Well, I think that once all that's happened, like the Care Partner, like they'll change. I'm assuming they changed the status of a field in there, which then sends a message to Brennan. I'm assuming we have a funding status or anything like that. How do you terminate. 
**Romy Blacklaw** *[36:09]*: You can close a Care plan. Just kind of who we thought you can. So if we have the consumer module that's connected to the Care plan module, you can close a care plan which would close our funding if we made multiple Care plans tied up to one consumer. But right now, like, if a client, their funding is withdrawn or they. They're done with their funding or done with Trilogy Care partner will go into the consumer module, press terminate, which terminates everything with Trilogy Care, not just our funding strategy. 
**Room 403** *[36:42]*: Okay, well, we need to bring the mechanism of termination into Portal then, because again, we can't have multiple consumer records unless we have a status inside the Care plan module that says terminate this particular funding stream and not the others. Yeah. 
**Romy Blacklaw** *[37:02]*: I think we should start to be clever with what we word things as. And like terminate. 
**Room 403** *[37:06]*: Let's. 
**Romy Blacklaw** *[37:06]*: Like the word terminate is for when you're getting rid of a whole client. Like Dave Dunn closing stuff. Yeah. Otherwise, like, I think we need to consider it as just closing off funding streams. Exiting a funding. Something's different, otherwise it's going to get. That's what it does in crota. It's exit. Let's keep it consistent. 
**Room 403** *[37:30]*: Would Care be making that decision to close a funding stream? 
**Romy Blacklaw** *[37:35]*: Yes. Yes. 
**Room 403** *[37:37]*: Does it need to be like verified by someone? Because, like, if we just have a button because we can hit the API to send an exit date for a funding stream. I think Tim said that we actually did the noi for that. So we can actually record. Yeah, I think we can. Entry departure. Entry departure. Yeah. For individual fundings. Yeah. So we could build something into all for that. But I just don't know who would be like there needs to be some sort of verification because that's just going to turn off the thumbing string. And do we want care partners doing that and what like decision making processes leading them to go. Yeah, because they might just like instead of deleting the draft funding stream, they might be like accidentally deleting, withdrawing real fundings. 
**Romy Blacklaw** *[38:17]*: What we need is a warning before they do it then like warning you are blah, blah. 
**Room 403** *[38:23]*: Yeah. 
**Romy Blacklaw** *[38:23]*: You're about to cancel Jones care. 
**Room 403** *[38:26]*: Okay. Because then that takes it off Brennan's plate and puts it on care partner's responsibility to do that. 
**Romy Blacklaw** *[38:32]*: Yeah. So at the moment it's only Beck who is doing it because she's got all of the restorative care and end of life ones. And we had a client that we onboarded that used all of their end of life in two weeks and we had no choice except to end their end of life and put them back on their ongoing. 
**Room 403** *[38:48]*: Okay, so I close off. I can close off any individual one. If they're all closed, I'm de facto terminated. But if I hit terminated in the normal course of events, it's going to inextricably shut everything down. 
**Romy Blacklaw** *[39:02]*: Yeah. Which ultimately isn't a bad thing. Like the majority of our client churn is because they die or go to residential. So ultimately I am closing it all off. Like I would say that makes up about 60% of our month to month client exits. So most of the short term pathways will just expire. But I do think there are the restorative care and restorative care can stay there anyway. It doesn't impact anything else. The end of life is the main one where they might use all their funding or they might not die and we need to turn their on back on. And the only way that we can do that is by ending the end of life. 
**Room 403** *[39:45]*: At the moment. They need to stop terminating in. 
**Romy Blacklaw** *[39:50]*: They might also decide that they don't want to be on restorative care. They don't like it. They don't want to be on end of life. They don't like it. And so that is. There will be cases. 
**Room 403** *[39:59]*: Yeah. Yep. So they need to. We just need to prevent everything from wrongly getting shut down. So we need that needs to be different. That needs to be in portal them to be able to shut down individual. 
**Romy Blacklaw** *[40:12]*: Ones and then CRM to close the whole thing. 
**Room 403** *[40:15]*: CRM to end everything. 
**Romy Blacklaw** *[40:17]*: Yeah, that makes sense because my retention workflow is also still based off the consumer model. 
**Room 403** *[40:21]*: So this must be a design element because I don't know if putting it on the budget plan would be correct because it's sort of like the package client level, like in like a new like tab on the package overview or something to be like record entry and departure, just so they're not like tinkering around with the budget and accidentally just withdrawing someone's funding. This way of generating a client, period. So if I've somehow got ATHM only beginning, then the consumer record de facto will only be based on the existence of this athm, including start and end dates. But then it's morphed into this. Multiple funding streams in portal only. Yes. What's. What are the implications of having a, say, a care plan and a consumer record that's only really referential to this other like, to ATHM funding streams app and. 
**Romy Blacklaw** *[41:21]*: Well, it can't. That's what we're saying. Right. It has to be able to like. So that's why we've built this funding and services module in CRM so that we can. We. We need as a business visibility when we've applied for additional funding streams as well, because it's a, like, it's a big opportunity essentially and we need to be able to track and monitor as we've applied for packages, how many of them get assigned what they get assigned, that type of thing. So we do need a record somewhere to say that when this person commenced with us, they only had home modification funding. And then six months into being a Trilogy client, they had a level four package. Three years later they had a level eight package. Like, we do need to be able to have visibility over those things. 
**Room 403** *[42:04]*: Is that the point of the primary and secondary funding streams as being fields? 
**Romy Blacklaw** *[42:12]*: I think that's for onboarding, but there's also like, after they've onboarded, it's more like understanding the whole client journey with Trilogy Care. 
**Room 403** *[42:22]*: So like, what did. 
**Romy Blacklaw** *[42:23]*: Yeah, how did we get them to start with? And then what do they experience? 
**Room 403** *[42:25]*: Well, with us? 
**Romy Blacklaw** *[42:26]*: Like we're talking like a decade style. Like, what's the client doing with us? 
**Room 403** *[42:31]*: I might need to, in my own time, deep dive into the functionality of the funding services module. But is that. That's all in zero at the moment? 
**Romy Blacklaw** *[42:42]*: No one's using it's just drafted like. Yeah, it's been drafted for that purpose, but We I've had no time to dedicate to it. So it's just. 
**Room 403** *[42:52]*: Yeah. So this was that like a history of the classifications? It's a history of the funding streams. 
**Romy Blacklaw** *[43:01]*: And the application for funding stream. Because I want to know did that Care Partner someone's overspending? Mary Smith is overspending. My expectation is that Care Partner A knows that Mary's overspending and goes and puts in an application for a package level review. But package level review may or may not ever get assigned. But we want to know that Care Partner A has done what they should have done and applied for one. 
**Room 403** *[43:27]*: Oh God. 
**Romy Blacklaw** *[43:28]*: Why was it in. Is it just in CRM for ease of creating rom? Is that pretty much just why that was the choice? Yeah. Yeah. Okay. 
**Room 403** *[43:39]*: So bring it back again. So the reason that we're having this meeting right now is because we wanted to have a Band Aid Solutions. There's an MVP for this. 
**Romy Blacklaw** *[43:49]*: Right. 
**Room 403** *[43:50]*: And the more integrations and whatnot. Like if we overcook the out of this, this short term solution, you know and, and I don't think it all in with. I don't think it is a short CRM like well then we might as well boarding. Is it boarding? What's that? Is there an argument to be made that we just actually proceed with the intended state in which case where the line is drawn between functionality that we want to have in Portal vs Zoho is the key question here because we don't want to be making more messy Zoho things if the intention is here is to bring it into Portal. So there's the lead to HCA lth that's the name of the EPIC in the TC portal that's got the idea brief that's updated things that we've been talking about today. Except this meeting. 
**Room 403** *[44:43]*: But like a key thing will be the only thing that we're leaving in Zoho conceivably could be just the lead module integration. But how the degree to which care plan module, service module and the consumer module, you know where how much that's going to continue to exist is up in the air like in. In terms of how big we want to make this by what is like business needs Romney. How quickly do we need to have this core functionality in by. 
**Romy Blacklaw** *[45:24]*: Now because we've got people who we can't claim any funds against. 
**Room 403** *[45:29]*: Okay. So it's about as urgent as possible. 
**Romy Blacklaw** *[45:31]*: Yeah. 
**Room 403** *[45:32]*: Okay. So well in that case does it need to be in lead care plans and consumers but we're Talking about just a multi select field that they can select. Oh like package level 80, whatever that's like from the onboarding perspective. But Rami's talking about we need something both. 
**Romy Blacklaw** *[45:50]*: Yeah, we need onboarding and we also need to know that after we existing. 
**Room 403** *[45:55]*: Ones that haven't been. Yeah, yeah we need the onboarding. We need them to know status as it's. As it's going. We need to within the assignment of a clinical care partner for E for. 
**Romy Blacklaw** *[46:08]*: Clinical care partners agreements. 
**Room 403** *[46:11]*: That's not that urgent. That's not that urgent. Work around that. Yeah, just work around that. That's been descoped. I made a ticket for it already in linear to capture the request spec it I've started. Is it in the lth? No, it's not in there. I've just specced it right in the code base. Hell yeah. Cool. With Chord. All right. Well after Wednesday we're doing it through the epic now agreements. The agreements. I think that's now no longer resolved because of the multi. The multiple options. 
**Romy Blacklaw** *[46:46]*: Yeah, that's not resolved. 
**Room 403** *[46:47]*: We need to draw a line here. If you actually want to get this done asap. We need to draw a line about what is. What's MVP and what's golden state. 
**Romy Blacklaw** *[46:54]*: Surely the agreements is coming to like a comfortable sort of risk appetite position for the business. Like how many clients is that like actual number? I think it more impacts existing clients who we've onboarded with a self managed agreement and then we're saying they can keep self managing their ongoing package but we only offer a fully coordinated restorative care and that's not captured in our agreement. 
**Room 403** *[47:28]*: Probably is a question I wish. I brought Aaron here. 
**Romy Blacklaw** *[47:33]*: All right. 
**Room 403** *[47:34]*: I'm going to create a new field here now. I'm going to see what's possible in Zoho CRM with JavaScript. Are you just sandbox mode? Yeah, this is sandbox mode. No, I'm editing ship it. 
**Romy Blacklaw** *[47:50]*: Cool. I'm going to go back to clone. 
**Room 403** *[47:53]*: Okay. All right. Send me anything. Any matrix is particularly the things where you've confused everybody with internal. External first different. The other thing I'm confused about is the coordination loading fee that is used on end of Life Services. 
**Romy Blacklaw** *[48:12]*: 10% unless it's done by an external coordinator who we've got an agreement with for a different amount. But that will be captured within their fee schedule. 
**Room 403** *[48:20]*: Correct? 
**Romy Blacklaw** *[48:21]*: Yeah. So end of life is actually. It's restorative care. That's the complicated one. End of life is whatever for me to understand. Oh really? 
**Room 403** *[48:30]*: Yeah. 
**Romy Blacklaw** *[48:32]*: End of life is just whatever the coordination loading is for whoever the coordinator is, except for if it's Trilogy is the coordinator, ours will always be 10%. So what we've given Beck the instruction to do now is just at the budget level, put in the custom coordination fee. 
**Room 403** *[48:53]*: Okay. 
**Romy Blacklaw** *[48:55]*: But the problem with that is if. 
**Room 403** *[48:56]*: It gets added as a coordinator for that package once end of life is on it. 
**Romy Blacklaw** *[49:00]*: Yeah, correct. The more complicated one is the restorative care because if they have an external coordinator for their ongoing package, their restorative care services need to have zero percent coordination waiting on. 
**Room 403** *[49:18]*: Yeah, yeah. That's easy for me to understand because we'll assign that service that had restorative to pull from restorative care and that would be the trigger to say use 0%. 
**Romy Blacklaw** *[49:30]*: Correct. 
**Room 403** *[49:31]*: Yeah. But with end of life, even if they're self managed, we would still charge according. 
**Romy Blacklaw** *[49:35]*: They won't be. They won't be self managed because as a self insurer. 
**Room 403** *[49:40]*: Okay. 
**Romy Blacklaw** *[49:40]*: I have to run away. Is that okay? 
**Room 403** *[49:42]*: Okay. Yeah. 
**Romy Blacklaw** *[49:44]*: Do you still need me to write that down somewhere? 
**Room 403** *[49:48]*: Sorry. 
**Romy Blacklaw** *[49:48]*: Yeah, you guys, even for me, Ron, just like I'm. When I have a group, we're going to be able to speak to all this. So the more you can give me around, that type of stuff is really helpful too. Yeah. There's a price comparison that Pat put together. I'll find it. 
**Room 403** *[50:03]*: You've got any matrices or anything? 
**Romy Blacklaw** *[50:08]*: What chat is this going in? 
**Room 403** *[50:11]*: All right, well, strictly speaking it's lth, but you can just email it to me if you want. 
**Romy Blacklaw** *[50:17]*: I don't know, but I don't think I'm in lth. Can you add me to lth? 
**Room 403** *[50:21]*: Yes. 
**Romy Blacklaw** *[50:22]*: All right. 
**Room 403** *[50:24]*: See ya. Ya. 
**Romy Blacklaw** *[50:25]*: Bye bye. Oh, wait. 
**Room 403** *[50:28]*: What? We want an inbox page. That is a high priority. 
**Romy Blacklaw** *[50:32]*: Yes. We need to know that these people have additional funding that we need to do something about. 
**Room 403** *[50:37]*: Okay. 
**Romy Blacklaw** *[50:37]*: Yeah. 
**Room 403** *[50:39]*: All right. 
**Romy Blacklaw** *[50:41]*: Thanks Tame. 
**Room 403** *[50:43]*: Thank you. Ciao. Good luck. Fireflies. Understanding anything? That was just saying. No. I've got a good course. Level one, level three. There's so many things flying around. 
**Romy Blacklaw** *[51:04]*: Okay. 
**Room 403** *[51:10]*: Do you know the rules? I think we're all. Hey, dude, what was wrong with on about with 80 special? Yeah, there's like a special assistant. So where is that? I've never seen that. It's not in the peak list. I've never heard if I'm still going. You just. Have we said everything important to say how? Like just to boil it all back that let me just temporarily. Speak freely. These are the options in Zoho CRM right now. 
