from reworkd_platform.services.anthropic import HumanAssistantPrompt, ClaudeService
from reworkd_platform.settings import settings, Settings


class ContentRefresherService:
    def __init__(self, settings: Settings):
        self.claude = ClaudeService(api_key=settings.anthropic_api_key)

    def add_info(self, target: str, info: str) -> str:
        # Claude: rewrite target to include the info
        prompt = HumanAssistantPrompt(
            human_prompt=f"Below are notes from some SOURCE articles:\n{info}\n----------------\nBelow is the TARGET article:\n{target}\n----------------\nPlease rewrite the TARGET article to add unique, new information from the SOURCE articles. The format of the article you write should STRICTLY be the same as the TARGET article. Don't remove any details from the TARGET article, unless you are refreshing that specific content with new information. After any new source info that is added to target, include inline citations using the following example format: 'So this is a cited sentence at the end of a paragraph[1](https://www.wisnerbaum.com/prescription-drugs/gardasil-lawsuit/, Gardasil Vaccine Lawsuit Update August 2023 - Wisner Baum).' Do not cite info that already existed in the TARGET article. Do not list citations separately at the end of the response",
            assistant_prompt="Here is a rewritten version of the target article that incorporates relevant information from the source articles:",
        )

        response = self.claude.completion(
            prompt=prompt,
            max_tokens_to_sample=5000,
        )

        response = "\n".join(
            [
                paragraph.strip()
                for paragraph in response.split("\n\n")
                if paragraph.strip()
            ]
        )
        return response


def main():
    target = """
    Rachel Lanier:The claims against Merck in our Gardasil litigation are based on injuries our client suffered when they went to get the HPV vaccine. Unfortunately, the Gardasil vaccine not only is not very effective against preventing HPV, but it actually causes autoimmune injuries.
One of the biggest ones is called POTS, which stands for Postural Orthostatic Tachycardia Syndrome. The other injury that a lot of our clients are suffering is actually primary or premature ovarian failure. So women are going and getting this vaccine when they’re young, ages nine to 39 is the primary age group, and then down the road finding out that because of them getting this vaccine, they’re not able to have children. So we are very passionate about these cases, and what Merck did is just, it’s such a shame.
Americans have filed dozens of lawsuits against Merck & Co. regarding its Gardasil HPV vaccine. Across the country, thousands of people have been seriously injured by this vaccine. Their injuries range from autoimmune disorders and premature ovarian failure to death. Learn more about the Gardasil vaccine, your legal rights, and as leaders in the litigation, how The Lanier Law Firm can help.
Rachel Lanier:
The state of the Gardasil litigation as of spring 2023 is that a lot of work and discovery is being done to comb through and uncover millions of pages of documents produced by Merck, do expert workup, and have the experts look into the client’s cases and explain the science to the judge, and eventually a jury. Bellwether discovery is about to ensue as summer 2023 bellwether selections are due. The Gardasil case is moving very quickly, and we are excited to get justice for our clients in the best way that we can.
Many Gardasil vaccine lawsuits are currently ongoing across the United States. Dozens of Gardasil lawsuits have been filed against Merck in federal court. The volume of Gardasil product liability cases is expected to grow very rapidly over the next year.
Three new cases have been added to the MDL since last month, bringing the total to 89 cases.
Per Managing Attorney Rachel Lanier, “Cases continue to be filed, and discovery is ongoing. Bellwether selection has taken place.” The 16 bellwether cases selected will be narrowed down to 6 for trials beginning in 2024.
Cases continue to be filed and transferred to the MDL every month. When the cases were initially consolidated to the MDL in August of 2022, 31 cases were pending. As of today, 86 cases against Merck have been filed and transferred to the MDL and remain open.
By submitting this form, you agree to our terms & conditions. Please read full disclaimer here.
Legally Reviewed By: Rachel Lanier
Gardasil Lawsuits: A Timeline
Merck’s Potential Misrepresentation of Gardasil’s Efficacy
The Vaccine Act
What Is the Gardasil Vaccine?
Gardasil Long-Term Side Effects
Why Should You Choose The Lanier Law Firm for Your Gardasil Lawsuit?
Frequently Asked Questions
Schedule a Free Consultation With Our Winning Gardasil Lawyers Today
In an important victory for the plaintiffs, Judge Conrad granted the plaintiffs’ motion to compel Merck to provide plaintiffs’ attorneys with access to its entire database of adverse reactions to the HPV vaccine, including the Merck Adverse Event Reporting and Review System (MARRS).
The total number of cases against Merck pending in the MDL has increased by four since last month, with 82 cases pending.
As cases continue to be filed by unsuspecting patients who have been left with autoimmune disorders after receiving a vaccine that was marketed as safe, 78 cases brought by injured victims and their parents are now pending in the MDL.
In the First Case Management Order, the court set the schedule for the next steps in the multidistrict litigation.
Bellwether trials are test trials used to gauge the outcome of a typical case to provide the remaining parties with guidance on how the cases should resolve. This provides an efficient method of resolving a large number of cases without the necessity of each individual case having to go to trial.
It prevents the court system from becoming overburdened and provides guidance for settlement negotiations. If plaintiffs in the bellwether cases receive favorable verdicts, it will incentivize Merck to offer fair and reasonable settlements.
In the first Case Management Order, Judge Conrad ordered the initial pool of 16 bellwether cases to be selected by June 1, 2023. The bellwether cases selected must have been transferred to the MDL on or before February 28, 2023.
Two of the pending cases were individually filed in the Western District of North Carolina before being transferred to the MDL. Judge Conrad ordered these two cases to be included in the initial bellwether pool. These cases are Hilton v. Merck and Co., (Case No. 5:22-CV-00030) and Bergin v. Merck & Co. (Case No. 3:22-CV-00117).
Plaintiffs’ attorneys and defendants’ attorneys will each select five cases to be included in the initial bellwether pool in addition to these two. The remaining four cases will be selected at random by the court.
The court affirmed the schedule the parties agreed to for any Daubert or summary judgment motions that may be filed in the case.
A Daubert motion is a motion to disqualify an expert for the purpose of excluding testimony by that expert. A summary judgment motion is a motion to dismiss a case before it goes to trial. Both of these motions are common in MDL lawsuits. Merck is expected to file a motion for summary judgment on the basis of federal preemption.
Federal preemption is a claim that federal law supersedes a state law that allows a plaintiff to sue. In such a motion, the defendants will likely argue that the National Childhood Vaccine Injury Act prohibits a lawsuit based on design defect claims against vaccine makers. They may base this on the Supreme Court decision in Bruesewitz v. Wyeth.
In this case, the Supreme Court ruled in favor of the drug maker. However, it did not prohibit lawsuits against drugmakers on the basis of negligence, as is being alleged in this litigation.
Judge Conrad ordered the following deadlines for these motions:
Plaintiffs’ general causation expert reports
March 14, 2024
Defendants’ general causation expert reports
April 11, 2024
Expert witness depositions/discovery
May 23, 2024
Daubert motions
July 8, 2024
Motions for summary judgment
July 8, 2024
Opposition to motions filed
August 22, 2024
Replies in support of motions filed
September 23, 2024
Case discovery is the investigation of the facts of the case, in which each party investigates the other party’s claims. It includes gathering documentation, interviewing witnesses, and completing depositions. Judge Conrad has ordered a written discovery deadline of December 14, 2023 and a fact discovery deadline of February 15, 2024.
Additional discovery deadlines have been set, beginning four months after the court has issued a ruling on a motion for summary judgment, if filed. If the court grants a summary judgment, the court will determine the next steps at that time.
If the court does not grant the motion, the remaining fact discovery for the 16 bellwether cases will be due in four months. The court further ordered that over the course of the following 164 days, the initial pool of 16 bellwether cases will be narrowed down to 6.
The number of cases pending in the MDL has more than doubled since the cases were initially transferred in August. The number of pending cases to date is 65.
Judge Conrad has issued the third pretrial order in the MDL. According to the order, the initial bellwether cases will be a select pool of cases in which the plaintiffs allege one of the following two injuries:
• Postural orthostatic tachycardia syndrome
• Primary ovarian failure or insufficiency
Judge Conrad granted a motion to dismiss the cases against Watchung Pediatrics, Susan P. Korb, APN, and Vineetha A. Alias, D.O. with prejudice. As pre-agreed by counsel, both sides will absorb their own attorney costs. The court affirmed that the claims against Merck & Co., Inc. will move forward and are unaffected by this order.
The number of cases in the MDL since the August 22, 2022 centralization has nearly doubled, with 60 cases pending and many more expected.
The defense filed a motion to dismiss the case against Watchung Pediatrics, Susan Korb APN, and Vioneetha Alias, D.O. (a pediatrician) on the grounds that plaintiffs failed to timely file an Affidavit of Merit in compliance with New Jersey law, and the time to do so has expired.
The number of cases pending in the MDL has increased to 59 as of today’s date.
Plaintiffs’ attorneys filed a motion to compel Merck to turn over the entirety of its Adverse Event Reporting and Review System, which will provide data on adverse events that were reported to Merck and when Merck became aware of these events. This motion was filed in response to Merck’s refusal to provide this information.
New cases are being filed and transferred to the MDL every month. As of today’s date, 57 cases are pending.
In less than two months, the number of cases pending in the MDL has grown from 31 to 55.
In the Second Pretrial Order in the case, Judge Conrad selected the plaintiff’s co-lead and liaison counsel. The Lanier Law Firm’s Rachel Lanier was among the three attorneys selected as co-lead counsel. This is an important role in an MDL case because the co-lead counsel determines the strategy for all the cases in the MDL.
Attorneys for Merck & Co., filed a position statement outlining their defense, claiming that the vaccine is safe, effective, and covered by the National Childhood Vaccine Injury Act. Under this act. According to Merck, the court should dismiss the lawsuits on this basis.
Merck’s attorneys further allege that there is no scientific evidence to support that Gardasil causes the conditions alleged by the defendants. Merck has requested that the court limit discovery and provide a speedy process to dismiss claims.
Attorneys for the plaintiffs filed the Plaintiffs’ Position Statement today. In the statement, plaintiffs state that they are pursuing damages on the following grounds:
• Negligence
• Failure to warn of Gardasil’s risk of autoimmune and neurological injuries
• Manufacturing defect
• Breach of warranty
• Common law fraud
• Violation of state consumer laws
Plaintiffs allege that Merck knowingly engaged in an active campaign to conceal and downplay these risks and actively misrepresented the efficacy of the product. Merck has refused to give plaintiffs access to its adverse event reporting database, according to the position statement.
Attorneys for the plaintiffs assert that court precedent places the burden on the defendant, not the plaintiffs, to prove that preemption applies. This would require the defendants to prove that they could not change the label because federal law prohibited it.
In just over a month, the number of claims pending in the MDL has risen from 31 cases to 49.
On August 4, 2022, the United States Judicial Panel on Multidistrict Litigation granted the motion to centralize the Gardasil cases against Merck. As of today’s date, 31 actions are pending in 22 districts. These cases will be transferred to the Honorable Judge Robert J. Conrad, Jr. of the Western District of North Carolina.
The court determined that centralization in the Western District of North Carolina would be appropriate on the basis that it is convenient and readily available to parties on both sides of the case. Two pending actions in the litigation were initially filed in this jurisdiction.
Plaintiffs in the litigation against Merck for autoimmune effects of its vaccine Gardasil filed a motion to transfer the cases to MDL. All plaintiffs supported centralizing the cases in MDL. In the motion, the plaintiffs proposed that the case be transferred to one of the following districts:
• The District of Arizona
• The Western District of Wisconsin
• The Central District of California
• The Middle District of Louisiana
The defendants opposed centralization but proposed that if centralization must occur, the cases be transferred to one of the following districts:
• The District of Connecticut
• The Eastern District of Michigan
In 2006, Merck began heavily marketing a misleading campaign that its Gardasil vaccine was a safe and effective way to prevent HPV infections. However, evidence has arisen that the Gardasil vaccine causes serious and disabling side effects. Plaintiffs claim the Gardasil vaccine’s manufacturer did not provide adequate warning of possible side effects associated with the product and that Merck fraudulently concealed evidence about the health risks of the vaccine while at the same time misrepresenting that Gardasil could prevent cervical cancer. Specifically, lawsuits have been filed against Merck for issues such as failure to warn, manufacturing defect, and negligence.
The Vaccine Act, or the National Childhood Vaccine Act of 1986, prohibits certain failures to warn and design defect claims against manufacturers. However, federal law does allow for negligence claims. Passed in 1986, the Vaccine Act created a no-fault compensation program for children suffering injuries from vaccines.
• Lasted more than six months after vaccination; or
• Resulted in inpatient hospitalization and surgery; or
• Resulted in the patient’s death.
You may file a petition under the Vaccine Act if the injury in question:
If the injury meets one of the above specifications, then you must file your petition within the following deadlines:
• You must file injuries within three years of the first symptom or the significant aggravation of the injury.
• Wrongful death cases must be filed within two years of the death and four years of the first symptom or the significant aggravation of the injury.
In some limited cases, the Vaccine Program may extend a deadline.
Generally, Gardasil and HPV vaccines are covered under the Vaccine Act.
The Gardasil vaccine developed by Merck was marketed to protect against the human papillomavirus (HPV) and can be received by anyone from ages 9 through 26 years. HPV is the most common sexually transmitted infection in the U.S. More than 150 strains of the virus exist, and while most infections resolve on their own, more than 40 strains can cause cancer. The U.S. Food and Drug Administration (FDA) approved the first-generation Gardasil vaccine in 2006 and the newer Gardasil 9 vaccine, which aims to protect against more virus strains, in 2014. Merck obtained a fast-track FDA approval for Gardasil with deceptive research trials, concealing material facts about the effectiveness and safety of Gardasil.
Scientific research has found that Gardasil induces and increases the risk of many long-term side effects related to autoimmune disorders and reproductive disorders, including:
If you or a loved one suffered side effects from Merck’s Gardasil vaccine, a trusted legal team can help. The Lanier Law Firm wants to hear your story and help you pursue legal action. We know what it takes to stand up to big pharma companies like Merck and win. We won the first-ever verdict against Merck, leading to a $4.85 billion national settlement over Merck’s drug Vioxx.
At The Lanier Law Firm, we understand pharmaceutical liability, and we know Gardasil.
Understanding key facts and context about the Gardasil vaccine, recalls, and other lawsuits will help you consider your options if you suspect the vaccine has caused you or your loved one to experience injury or adverse side effects.
Rachel Lanier:
In order to file a Gardasil lawsuit, because it’s a vaccine, first, a claim has to go through the vaccine program that is set up by the US government. And we have lawyers who can help consult through that process. After that ends up happening, a lawsuit in civil court can be filed, and right now the multi-district litigation case is pending in North Carolina at this time.
Evan Janush:
And on this subject, Rachel, we should probably also discuss the notion that many of the victims of Gardasil are children, teenagers, and young folks, some of whom may not have reached the age of majority, who have to have their parent, mother, or father or guardian file on their behalf and retain a law firm such as the Linear Law Firm on behalf of that minor child.
Rachel Lanier:
That’s absolutely true. It’s devastating to see what has happened to our clients and their children. And a lot of the times we’re working closely with parents to protect their children and their children’s rights to pursue a legal claim moving forward.
Multiple lawsuits against Merck for serious side effects stemming from its Gardasil vaccine are pending. There are now approximately 60 active Gardasil lawsuits pending in the Gardasil class action MDL in the Western District of North Carolina. An influx of new cases are expected to be filed at some point in the near future as previously filed Gardasil claims clear the Vaccine Injury Compensation Program process.
On December 16, 2013, the CDC was informed by Merck that the company planned to implement a voluntary recall of one lot (lot J007354) of Gardasil Vaccine due to the potential for a small number of vials to contain glass particles as a result of breakage during the manufacturing process. Then again, in October 2020, Merck issued an urgent voluntary vaccine recall of Gardasil 9 belonging to Lot R030456. Merck recalled Gardasil, a temperature-sensitive vaccine because units were stored at inappropriate temperatures.
Many have complained of negative side effects after receiving Merck’s Gardasil vaccine. Complaints range from dizziness and fainting to developing autoimmune disorders and even death. According to the Vaccine Adverse Event Reporting System (VAERS), there have been 64,000 adverse events reported against Gardasil in the United States alone. Of these, nearly 10,000 have been serious negative events, including 547 deaths.
After the FDA fast-track approval of the Gardasil 9 vaccine in 2006, the original Gardasil vaccine was phased out of the U.S. Market; and is no longer available for sale in the United States. The last doses of Gardasil-4 expired on May 1, 2017. Since late 2016, Gardasil 9 is the only HPV vaccine distributed in the U.S.
If Merck’s Gardasil vaccine against HPV has harmed you or a loved one, you may have legal options even if you’re experiencing Gardasil side effects years later. The Lanier Law Firm is committed to holding pharmaceutical companies accountable. Schedule a free consultation with our experts to get answers to your questions and more information about your options.
Or
Or
By submitting this form, you agree to our terms & conditions. Please read full disclaimer here.
(713) 659-5200
    """
    info = """
    - The study included 505 patients with autoimmune diseases and 203 healthy controls who completed a questionnaire at least 4 days after their first COVID-19 vaccination.
- The most common vaccines received were ChAdOx1 nCoV-19 (AstraZeneca) and BNT162b2 (Pfizer/BioNTech).
- The most common adverse event was pain at the injection site. Other common systemic adverse events were fatigue and headache.
- Joint complaints were reported more frequently by patients than controls, but only 5% of patients reported worsening of their autoimmune disease after vaccination.
- Immunosuppressive treatment was postponed in 6% of patients due to vaccination.
- Multivariable regression analyses showed no difference in adverse events between patients and controls.
- Younger age and female sex were associated with more adverse events.
- Most participants felt safer after vaccination, and 20% of patients reported improved quality of life.
- The study relied on patient self-report rather than validated measures to assess disease activity.
- The control group was not an exact demographic match to the patient group.

Source: https://www.ncbi.nlm.nih.gov/pmc/articles/PMC8213359/, Adverse events after first COVID-19 vaccination in patients with autoimmune diseases - PMC - NCBI, Jun 18, 2021

- Vaccines have been used for over 200 years. Smallpox was eradicated mainly due to vaccination programs.
- Vaccines are associated with adverse events, usually transient and acute but sometimes hypersensitivity and autoimmunity.
- Infectious agents like viruses can trigger autoimmunity through molecular mimicry, epitope spreading, and polyclonal activation.
- Adjuvants like aluminum can persist in the body, trigger inflammatory responses, pass the blood-brain barrier, and cause neurotoxicity.
- Animal models show aluminum adjuvants can cause neurological and autoimmune issues.
- Vaccines have been linked to thrombocytopenia, arthritis, transverse myelitis, SLE, vasculitis, bullous diseases, inflammatory myopathies, narcolepsy, and more.
- Specific details on molecular mimicry between vaccines and autoantigens.
- Use of cytokines like TNF as vaccine antigens to induce anti-cytokine antibodies.
- Vaccinomics and use of genetics to predict vaccine reactions.
- Registry of ASIA syndrome cases to study adverse reactions.
- Guidelines on vaccinating patients with autoimmune diseases.
- Need for improved placebo controls and long-term studies of vaccines.
- Potential future approaches like personalized vaccines based on host genetics.

Source: https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7129276/, Vaccines, adjuvants and autoimmunity - PMC - NCBI

- The review was conducted up to October 31, 2021 and included 268 vaccines in development, 97 in clinical testing, and 20 in use as of September 1, 2021.
- The platforms for COVID-19 vaccines include viral vector (replicating and non-replicating), protein-based (subunit, virus-like particle), nucleic acid (RNA, DNA), and whole virus (inactivated or weakened).
- There are 17 non-replicating and 2 replicating viral vector candidate vaccines in clinical development.
- Non-replicating viral vector vaccines have been approved for emergency use.
- SARS-CoV-2 variants may lead to antibody escape, reinfection, and reduced vaccine effectiveness.
- Healthy post-vaccination individuals exhibit increases in type I IFN, oxidative stress, and DNA damage in blood cells.
- Sprent and King propose side effects are from transient IFN-I with immune response induction.
- Complement activation by anti-PF4 antibodies is implicated in VITT.
- Polysorbate 80 may play a role in localizing VITT to the central nervous system.
- Antiphospholipid antibodies and complement activation may also be involved in VITT.
- Treatment for VITT involves no-heparin anticoagulants and intravenous immunoglobulin.
- Molecular mimicry between vaccine components and self-antigens can lead to autoimmunity.
- Influenza, hepatitis B, and HPV vaccines have been associated with autoimmunity via molecular mimicry.
- Pregnancy and drugs may be confounding factors in reported autoimmune hepatitis cases.
- GBS incidence after vaccination in India was higher than expected.
- mRNA vaccines have not been previously evaluated for causality with IgA nephropathy.
- Patients with pre-existing IgA nephropathy had recurrence after vaccination.
- Arthritis, SLE, and Graves' disease have been reported after vaccination.
- Ongoing monitoring of autoimmune events is needed to assess causality.

Source: https://onlinelibrary.wiley.com/doi/10.1111/imm.13443, New‐onset autoimmune phenomena post‐COVID‐19 vaccination - Wiley Online Library, Dec 27, 2021
    """
    response = ContentRefresherService(settings=settings).add_info(target, info)
    print(response)


if __name__ == "__main__":
    main()
