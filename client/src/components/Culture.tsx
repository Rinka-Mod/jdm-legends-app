/**
 * JDM LEGENDS — Văn hoá JDM.
 * Tác giả gốc / Original author: Rinka-Mod — © 2026. All rights reserved.
 */

import { useEffect, useState } from "react";
import { fetchCulture } from "../lib/api";
import type { CultureTopic } from "../types";

export function Culture() {
  const [topics, setTopics] = useState<CultureTopic[]>([]);

  useEffect(() => {
    fetchCulture()
      .then((data) => setTopics(data.culture))
      .catch(() => setTopics([]));
  }, []);

  return (
    <section className="section culture" id="culture">
      <span className="section__kanji" aria-hidden="true">
        文化
      </span>

      <div className="wrap">
        <header className="section__head">
          <p className="eyebrow reveal">
            <span>03</span> Văn hoá
          </p>
          <h2 className="section__title reveal" data-delay="80">
            Đường phố <em>là sân khấu</em>
          </h2>
          <p className="section__desc reveal" data-delay="160">
            JDM không chỉ là xe. Đó là những nhóm bạn chạy đèo lúc 3 giờ sáng, những xưởng độ nhỏ
            trong ngõ hẹp Osaka, và cả một ngôn ngữ riêng của dân chạy đường.
          </p>
        </header>

        <div className="culture__grid">
          {topics.map((topic, i) => (
            <article className="culture-card reveal" data-delay={i * 60} key={topic.en}>
              <span className="culture-card__kanji">{topic.jp}</span>
              <span className="culture-card__idx">{String(i + 1).padStart(2, "0")}</span>
              <h3>{topic.en}</h3>
              <p className="culture-card__jp">{topic.jp}</p>
              <p>{topic.desc}</p>
              <span className="culture-card__line" />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
