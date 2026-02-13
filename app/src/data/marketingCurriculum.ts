import { BookOpen, BrainCircuit, Target, Lightbulb, TrendingUp } from 'lucide-react';

export interface CurriculumItem {
    id: string;
    title: string;
    description: string;
    author: string;
    category: 'basic' | 'advanced' | 'hack';
    icon: any;
    readTime: string;
    tags: string[]; // Added tags for better searchability
    content: {
        intro: string;
        keyPoints: { title: string; desc: string }[];
        godariNote: string;
    };
}

export const MARKETING_CURRICULUM: CurriculumItem[] = [
    {
        id: 'jachung-6-principles',
        title: '인간을 조종하는 6가지 심리 법칙',
        description: '자청이 추천한 클루지 & 설득의 심리학 핵심 요약. 뇌를 자극하여 구매를 유도하는 불변의 법칙입니다.',
        author: '이상한 마케팅 (Inspired)',
        category: 'hack',
        icon: BrainCircuit,
        readTime: '10 min',
        tags: ['#심리학', '#자청', '#설득', '#구매전환', '#클루지'],
        content: {
            intro: "사람은 이성적으로 판단한다고 착각하지만, 실제로는 진화론적 본능(클루지)에 의해 움직입니다. 이 6가지 버튼만 누르면 고객은 거부할 수 없습니다.",
            keyPoints: [
                { title: "상호성의 원칙 (Reciprocity)", desc: "먼저 주어라. 인간은 받으면 갚고 싶어 하는 부채감을 느낍니다. (예: 무료 전자책, 샘플 제공)" },
                { title: "사회적 증거 (Social Proof)", desc: "남들이 하는 건 안전하다. 리뷰수, 구매 건수, 동시 접속자 수를 노출하세요." },
                { title: "희소성 (Scarcity)", desc: "가질 수 없으면 더 원하게 된다. '한정 수량', '오늘 마감'은 인간의 손실 회피 본능을 자극합니다." },
                { title: "권위 (Authority)", desc: "전문가의 말은 의심하지 않는다. 수상 경력, 인증서, 의사 가운을 입은 사진 등을 활용하세요." },
                { title: "일관성 (Consistency)", desc: "작은 예스(Yes)를 받아내라. 한번 입장을 정하면 인간은 그에 맞춰 행동하려 합니다." },
                { title: "호감 (Liking)", desc: "나와 비슷한 사람, 매력적인 사람에게 끌린다. 브랜드의 인간적인 면모를 보여주세요." }
            ],
            godariNote: "부장님, 우리 릴리맥에도 바로 적용해봅시다. 특히 '희소성' 전략으로 '이달의 플라워 구독 - 30명 한정' 문구를 넣어보면 어떨까요? 클릭률이 20%는 뛸 겁니다."
        }
    },
    {
        id: 'kotler-4p',
        title: '마케팅의 아버지 필립 코틀러의 4P 믹스',
        description: '마케팅의 기본 중의 기본. 제품, 가격, 유통, 판촉의 조화를 이해합니다.',
        author: 'Philip Kotler',
        category: 'basic',
        icon: BookOpen,
        readTime: '15 min',
        tags: ['#기초이론', '#4P', '#전략', '#제품기획', '#가격책정'],
        content: {
            intro: "마케팅은 단순히 광고가 아닙니다. 4가지 요소가 오케스트라처럼 조화를 이룰 때 시장을 장악할 수 있습니다.",
            keyPoints: [
                { title: "Product (제품)", desc: "고객의 문제를 해결하는 솔루션인가? 품질, 디자인, 패키징이 경쟁사보다 우월한가?" },
                { title: "Price (가격)", desc: "단순히 싸게 파는 것이 아니다. 가치 대비 합리적인가? 스키밍(고가전략)인가 침투(저가전략)인가?" },
                { title: "Place (유통)", desc: "고객이 제품을 어디서 만나는가? 온라인 자사몰, 오프라인 팝업, 퀵커머스 등 접점 최적화." },
                { title: "Promotion (판촉)", desc: "어떻게 알릴 것인가? 광고, PR, 영업 판촉 등 고객과의 커뮤니케이션 전략." }
            ],
            godariNote: "요즘은 4C(Customer, Cost, Convenience, Communication)로 진화했지만, 4P는 여전히 근본입니다. 우리 릴리맥은 'Place' 즉 배송 경험을 '공간 스타일링'으로 격상시켜야 합니다."
        }
    },
    {
        id: 'funnel-strategy',
        title: '깔때기만 잘 짜도 매출이 터진다 (세일즈 퍼널)',
        description: '고객이 우리를 처음 발견하고 구매하기까지의 여정을 설계하는 법.',
        author: 'Growth Hacking Team',
        category: 'advanced',
        icon: TrendingUp,
        readTime: '12 min',
        tags: ['#퍼널전략', '#고객여정', '#TOFU_MOFU_BOFU', '#전환율'],
        content: {
            intro: "물고기를 잡으려면 그물을 넓게 펼치는 것이 아니라, 물고기가 다닐 길목을 막아야 합니다. 이것이 퍼널(Funnel)입니다.",
            keyPoints: [
                { title: "TOFU (Top of Funnel)", desc: "인지 단계. 블로그, 유튜브, 인스타 광고로 최대한 많은 잠재 고객을 유입시킵니다." },
                { title: "MOFU (Middle of Funnel)", desc: "고려 단계. 상세페이지, 후기, 뉴스레터를 통해 우리 제품이 필요함을 설득합니다." },
                { title: "BOFU (Bottom of Funnel)", desc: "전환 단계. 할인 쿠폰, 기간 한정 혜택으로 구매 결정을 내리게 만듭니다." }
            ],
            godariNote: "릴리맥의 인스타(TOFU)는 예쁜데, 상세페이지(MOFU)가 너무 건조합니다. 감성적인 스토리텔링을 중간 단계에 보강해서 구매 전환을 높여봅시다."
        }
    },
    {
        id: 'copywriting-magic',
        title: '뇌에 꽂히는 한 줄, 카피라이팅 불변의 법칙',
        description: '고객을 미치게 만드는 글쓰기. "사라"는 말 대신 "갖고 싶게" 만들어라.',
        author: 'Copywriter Legend',
        category: 'hack',
        icon: Lightbulb,
        readTime: '8 min',
        tags: ['#카피라이팅', '#글쓰기', '#구매유도', '#후킹'],
        content: {
            intro: "잘 쓴 카피 하나가 열 마케터 안 부럽다. 고객의 언어로, 고객의 욕망을 건드려야 합니다.",
            keyPoints: [
                { title: "Why Me? (왜 나인가?)", desc: "고객은 당신에게 관심 없습니다. '자신'에게 어떤 이득이 있는지에만 관심이 있죠." },
                { title: "So What? (그래서 뭐?)", desc: "기능(Feature)을 말하지 말고 혜택(Benefit)을 말하세요. '고성능 모터'가 아니라 '청소 시간이 절반으로 줍니다'라고." },
                { title: "Now or Never (지금 아니면 안 돼)", desc: "긴박감을 조성하세요. 인간은 나중으로 미루는 순간 영원히 안 삽니다." }
            ],
            godariNote: "우리 릴리맥 상세페이지에 '싱싱한 꽃'이라고 쓰지 마세요. '새벽 4시, 양재동에서 가장 먼저 골라온 꽃'이라고 쓰세요. 그게 팔리는 글쓰기입니다."
        }
    },
    {
        id: 'stp-strategy',
        title: '전쟁에서 승리하는 법: STP 전략',
        description: '모두를 만족시키면 아무도 만족시킬 수 없다. 내 구역을 정하고 깃발을 꽂는 법.',
        author: 'Academic Strategy',
        category: 'basic',
        icon: Target,
        readTime: '10 min',
        tags: ['#전략기획', '#STP', '#타겟팅', '#포지셔닝', '#시장세분화'],
        content: {
            intro: "시장은 넓고 경쟁자는 많습니다. STP는 우리가 이길 수 있는 싸움판을 고르는 과정입니다.",
            keyPoints: [
                { title: "Segmentation (시장 세분화)", desc: "시장을 나이, 소득, 라이프스타일 등으로 쪼개보세요. 20대 대학생과 40대 자산가는 전혀 다른 시장입니다." },
                { title: "Targeting (타겟 선정)", desc: "쪼갠 시장 중 우리가 가장 잘 공략할 수 있는 핵심 타겟을 찍으세요. '선택과 집중'입니다." },
                { title: "Positioning (포지셔닝)", desc: "고객의 머릿속에 우리 브랜드를 어떤 단어로 기억시킬 것인가? (예: 볼보=안전, 릴리맥=공간스타일링)" }
            ],
            godariNote: "릴리맥은 '모든 사람'을 위한 꽃집이 아닙니다. '공간의 가치를 아는 프리미엄 고객'으로 타겟을 좁혀야 비싼 가격도 설득력이 생깁니다."
        }
    },
    {
        id: 'lilymag-b2b-timing',
        title: 'B2B 꽃 마케팅의 정점: 타이밍과 편리함의 미학',
        description: '여의도 오피스 상권에서 30년간 살아남은 릴리맥의 기업 고객 선점 전략.',
        author: '고다리 부장 (NotebookLM 연동)',
        category: 'basic',
        icon: Target,
        readTime: '12 min',
        tags: ['#B2B마케팅', '#기업영업', '#타이밍', '#릴리맥전통'],
        content: {
            intro: "꽃집이 단순히 '예쁜 꽃'만 팔아서는 오피스 상권에서 버틸 수 없습니다. 기업 고객은 예산 집행 시기와 목적이 명확합니다.",
            keyPoints: [
                { title: "기업 행사 캘린더 장악", desc: "주요 파트너사의 창립기념일, 인사이동 시즌을 미리 파악하고 제안서를 선제적으로 발송합니다." },
                { title: "공간 케어(Plant Care) 침투", desc: "사무실 식물 관리 서비스로 정기적인 방문 접점을 만들고, 이를 행사 주문으로 연결합니다." },
                { title: "결재 맞춤형 카탈로그", desc: "실무자가 결재 올리기 편하도록 가격대별 법인 카드 맞춤형 카탈로그를 상시 구비합니다." }
            ],
            godariNote: "우리 릴리맥이 LG전자나 대형 은행들이랑 수십 년간 파트너를 유지한 비결? 꽃이 시들기 전에 미리 가서 갈아주는 서비스였어. 고객의 '불편함'을 해결해주는 게 마케팅이야."
        }
    },
    {
        id: 'lilymag-spatial-styling',
        title: '객단가를 3배 높이는 공간 스타일링 법칙',
        description: '꽃 자체보다 공간과의 조화를 제안하여 부가 가치를 창출하는 릴리맥의 핵심 철학.',
        author: '릴리맥 기획팀 (NotebookLM 연동)',
        category: 'advanced',
        icon: Lightbulb,
        readTime: '15 min',
        tags: ['#공간스타일링', '#프리미엄전략', '#객단가상승', '#인테리어큐레이션'],
        content: {
            intro: "고객은 꽃 자체가 아니라 꽃으로 인해 변화될 자신의 공간 분위기를 구매합니다. 공간 연출력을 소매 마케팅에 적용하세요.",
            keyPoints: [
                { title: "공간 분석 기반 큐레이션", desc: "어떤 꽃이 아니라 어디에 두실지를 먼저 물으십시오. 벽지 색, 조명에 맞춰 화병과 꽃을 추천합니다." },
                { title: "토탈 리빙 오브제 전략", desc: "꽃과 어울리는 앤틱 촛대, 액자 등을 함께 디스플레이하여 세트 구매를 유도합니다." },
                { title: "테마가 있는 정기 구독", desc: "'빅토리안 거실', '초여름의 숲'처럼 명확한 인테리어 컨셉을 부여하여 구독 가치를 높입니다." }
            ],
            godariNote: "웨딩 장식할 때 조명부터 체크하는 게 우리 원칙이야. 집도 똑같아. 공간 전문가로 포지셔닝해야 비싼 가격도 설득력이 생기는 거야."
        }
    },
    {
        id: 'lilymag-ai-hyper-personalization',
        title: '30년 장부 데이터를 해킹하는 AI 초개인화 비법',
        description: '전통의 고객 관리 비법을 최신 AI 기술로 되살려 재구매율을 극대화하는 법.',
        author: '개발이 본부장 (NotebookLM 연동)',
        category: 'hack',
        icon: BrainCircuit,
        readTime: '10 min',
        tags: ['#초개인화', '#CRM', '#데이터마케팅', '#AI혁신'],
        content: {
            intro: "베테랑 플로리스트의 기억력을 시스템화하세요. 30년 노하우를 데이터화하고 AI를 통해 적시에 건네는 선제적 제안이 핵심입니다.",
            keyPoints: [
                { title: "세밀한 고객 선호도 기록", desc: "사소한 취향 정보를 기록하고, AI가 다음 주문 시 자동으로 이를 체크하게 합니다." },
                { title: "AI 선제적 제안 (Proactive)", desc: "기념일 전에 과거 이력과 트렌드를 분석하여 먼저 메시지를 보내는 케어 서비스를 구축합니다." },
                { title: "데이터 기반 실패 없는 추천", desc: "VIP 고객 만족도가 높았던 데이터를 근거로 까다로운 선물 상황에서 의사결정을 돕습니다." }
            ],
            godariNote: "옛날엔 장부에다 적었지? 이제는 AI가 다 해줘. 손님이 까먹은 기념일을 우리가 먼저 챙겨주는데 안 사고 배겨? 이게 릴리맥의 진화 방식이야."
        }
    }
];

