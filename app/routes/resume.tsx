import React from "react";
import { useParams, useNavigate } from "react-router";
import { Link } from "react-router";
import { useEffect, useState } from "react";
import { usePuterStore } from "~/lib/puter";
import Summary from "~/components/Summary";
import Details from "~/components/Details";
import ATS from "~/components/ATS";

export const meta = () => {
  return [
    { title: "SmartResume | Resume" },
    {
      name: "description",
      content: "View your resume and get feedback",
    },
  ];
};

const resume = () => {
  const { id } = useParams();
  const { auth, isLoading, fs, kv } = usePuterStore();
  const [resumeURL, setResumeURL] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !auth.isAuthenticated)
      navigate(`/auth?next=/resume/${id}`);
  }, [isLoading]);

  useEffect(() => {
    const LoadResume = async () => {
      const resume = await kv.get(`resume:${id}`);
      if (!resume) {
        return;
      }
      const data = JSON.parse(resume);
      const resumeBlob = await fs.read(data.resumePath);
      if (!resumeBlob) {
        return;
      }
      const pdfBlob = new Blob([resumeBlob], { type: "application/pdf" });
      const resumeURL = URL.createObjectURL(pdfBlob);
      setResumeURL(resumeURL);

      const imageBlob = await fs.read(data.imagePath);
      if (!imageBlob) {
        return;
      }
      const imageURL = URL.createObjectURL(imageBlob);
      setImageURL(imageURL);

      setFeedback(data.feedback);
      console.log({ resumeURL, imageURL, feedback: data.feedback });
    };
    LoadResume();
  }, [id]);

  return (
    <main className="!pt-0">
      <nav className="resume-nav">
        <Link to="/" className="back-button">
          <img src="/icons/back.svg" alt="logo" className="w-2.5 h-2.5" />
          <span className="texxt-gray-800 text-sm font-semibold">
            Back to Homepage
          </span>
        </Link>
      </nav>
      <div className="flex flex-row w-full max-lg:flex-col-reverse">
        <section className="feedback-section bg-[url('/images/bg-small.svg')] bg-cover h-[100vh] sticky top-0 items-center justify-center">
          {imageURL && resumeURL && (
            <div className="animate-in fade-in duration-1000 gradient-border max-sm:m-0 h-[90%] max-2xl:h-fit w-fit">
              <a href={resumeURL} target="_blank" rel="noopener noreferrer">
                <img
                  src={imageURL}
                  className="w-full h-full object-contain rounded-2xl"
                  title="resume"
                ></img>
              </a>
            </div>
          )}
        </section>
        <section className="feedback-section">
          <h2 className="text-4xl !text-black font-bold">Resume Feedback</h2>
          {feedback ? (
            <div className="flex flex-col gap-8 animate-in fade-in duration-1000">
              <Summary feedback={feedback} />
              <Details feedback={feedback} />
              <ATS
                score={feedback.ATS.score || 0}
                suggestions={feedback.ATS.tips || []}
              />
            </div>
          ) : (
            <img src="/images/resume-scan-2.gif" className="w-full"></img>
          )}
        </section>
      </div>
    </main>
  );
};

export default resume;
