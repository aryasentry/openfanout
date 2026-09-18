// Captured from the rendered MLOps topic panels in Chrome on 2026-09-06.
// Only portable YouTube destinations are stored; no lesson prose is copied.
const captures: [anchor: string, youtubeId: string, recommendedIds: string[]][] = [
  ['mlops-intro-to-mlops', 's0uaFZSzwfI', ['biqYkVf-a7Y']],
  ['mlops-git-github-mlops', 'hqQBF0EubVo', []],
  ['mlops-oops-python', 'ZDa-Z5JzLYM', ['ZDa-Z5JzLYM']],
  ['mlops-data-versioning-dvc', 'kLKBcPonMYw', []],
  ['mlops-mlflow-experiment-tracking', 'jZk4triALGo', ['tVskbekONlw']],
  ['mlops-continuous-integration', 'VRe4xkgHjaM', []],
  ['mlops-docker-mlops', 'GJWPmff2df8', ['8vmKtS8W7IQ']],
  ['mlops-project-1-vehicle-insurance', '0rFNsOx9gUo', []],
  ['mlops-mongodb-setup', 'T1U7rniplCE', []],
  ['mlops-data-ingestion', 'iHE4eRksidQ', []],
  ['mlops-data-validation-transformation', 'tSwH1i1bl7A', []],
  ['mlops-model-eval-aws-s3', 'g6XRDzCLzA0', []],
  ['mlops-fastapi-ml-app', 'hqVeBtp7J_E', ['h5wLuVDr0oc']],
  ['mlops-cicd-aws', 'lTt_5CZmnwQ', []],
  ['mlops-kubernetes-part-1', 's_o8dwzRlu4', ['s_o8dwzRlu4']],
  ['mlops-project-2-kubernetes', 'c_CzCsCnWoU', []],
  ['mlops-prometheus-grafana', '9TJx7QTrTyo', ['h4Sl21AKiDg']],
  ['mlops-project-3-monitoring', 'fzny5uUaAeY', []],
  ['mlops-capstone-project-1', '8T1dx1sP-X0', []],
  ['mlops-mlflow-dagshub', 'yKxOG6qdjvg', []],
  ['mlops-app-building-automation-dvc', '71IGzyH95UY', []],
  ['mlops-cicd-implementation-capstone', 'xwyJexAnt9k', []],
  ['mlops-eks-cluster-deployment', 'T4UGsVn0D_I', []],
  ['mlops-prometheus-grafana-eks', 'S41v1lVThds', []],
];

export const observedAiMedia = captures.map(([topicAnchorId, youtubeId, recommendedIds]) => ({
  topicAnchorId,
  youtubeId,
  watchUrl: `https://www.youtube.com/watch?v=${youtubeId}`,
  sourceUrl: `https://fanout.sh/ai/overview#${topicAnchorId}`,
  checkedAt: '2026-09-06',
  recommendedVideos: recommendedIds.map(id => ({
    youtubeId: id,
    watchUrl: `https://www.youtube.com/watch?v=${id}`,
  })),
}));

// The source control is labelled "10.05 Evaluation & Deployment Notes".
// Opening it on 2026-09-06 showed no iframe or video link.
export const notesOnlyAiTopic = 'fine-tuning-evaluation';
