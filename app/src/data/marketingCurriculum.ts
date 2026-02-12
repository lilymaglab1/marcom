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
    }
];
