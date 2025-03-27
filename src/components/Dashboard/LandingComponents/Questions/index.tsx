"use client";

import React, { useState } from "react";
import { Fade } from "react-awesome-reveal";
import styles from "@/styles/questions.module.scss";
import { useSelector } from "react-redux";
import Image from "next/image";

export const QuestionsAndAnswers = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const changeTab = (index: number) => {
    setCurrentTab(index);
    setCurrentQuestion(0);
  };

  const showHideAnswer = (index: number) => {
    if (index + 1 !== currentQuestion) setCurrentQuestion(index + 1);
    else setCurrentQuestion(0);
  };

  const configData: any = useSelector((store: any) => store?.config?.data);

  const groupedQuestions =
    configData?.faqs?.QuestionsData?.reduce((acc: any, question: any) => {
      const categoryName = question?.category_name;
      if (!acc[categoryName]) {
        acc[categoryName] = [];
      }
      acc[categoryName].push(question);
      return acc;
    }, {}) || {};

  // Use optional chaining and nullish coalescing to safely get keys
  const categories = Object.keys(groupedQuestions ?? {});

  return (
    <div className={styles.cardContainer} id="faq-degen">
      <span className={styles.cardTitle}>{configData?.faqs?.title}</span>
      <span className={styles.cardSubTitle}>
        {" "}
        {configData?.faqs?.description}{" "}
      </span>
      <div className="main-content">
        <div className={styles.headerTab}>
          {(categories || []).map((category, index) => (
            <div
              className={`${styles.headerItem} ${
                index === currentTab && "active"
              }`}
              key={index}
              onClick={() => changeTab(index)}
            >
              <span>{category}</span>
            </div>
          ))}
          {(!categories || categories.length === 0) &&
            (configData?.faqs?.QuestionsData ?? []).map(
              (question: any, index: any) => (
                <div
                  className={`${styles.headerItem} ${
                    index === currentTab && "active"
                  }`}
                  key={index}
                  onClick={() => changeTab(index)}
                >
                  <span>{question?.tabName}</span>
                </div>
              )
            )}
        </div>

        <div className={styles.QAContainer}>
          {groupedQuestions[categories[currentTab]]?.map(
            (data: any, index: any) => (
              <div key={index}>
                {data?.faqs.map((faq: any, faqIndex: any) => (
                  <div key={faq.id} className={styles.QAItem}>
                    <div
                      className={styles.question}
                      onClick={() => showHideAnswer(faqIndex)}
                    >
                      {faq.question}
                      <div
                        className={styles.questionToggle}
                        onClick={() => showHideAnswer(faqIndex)}
                      >
                        <span>
                          {faqIndex + 1 === currentQuestion ? (
                            <Image
                              width={18}
                              height={18}
                              src="assets/images/icons/minus.svg"
                              alt=""
                            />
                          ) : (
                            <Image
                              width={18}
                              height={18}
                              src="assets/images/icons/plus.svg"
                              alt=""
                            />
                          )}
                        </span>
                      </div>
                    </div>
                    {faqIndex + 1 === currentQuestion && (
                      <Fade duration={1000}>
                        <div
                          dangerouslySetInnerHTML={{ __html: faq.answer }}
                          className={styles.answer}
                        />
                      </Fade>
                    )}
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};
