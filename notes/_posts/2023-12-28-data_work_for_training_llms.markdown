---
layout: post
title:  "What goes into data work for training LLMs?"
date:   2023-12-28 10:02:49 -0800
categories: llm learning
---

When people think of the technical aspects of LLM pre-training[^1], they mostly think about the algorithms (e.g., the Transformer architecture), and the compute (GPUs and programming with GPUs). Data is mostly overlooked, but it's important and has a lot of nuances and interesting dynamics. In this post, I’ll share a summary of what I learned about data work for LLMs, based purely on information in the public domain.

I'll split the over into three categories: cleaning, curation, and scheduling.

# Cleaning

Cleaning is removing low quality data and data repetition. Many large LLMs include appendices on how they perform the cleaning (such as Gopher, t5), andthere has been a few papers dedicated to dataset preparation: [the Pile](https://arxiv.org/pdf/2101.00027.pdf) (2020), [RefinedWeb](https://arxiv.org/abs/2306.01116) (2023). Below is an excerpt from Gopher that gives a good schetch of filtering flavors:

> We remove any document that does not contain between 50 and 100,000 words, or whose mean word length is outside the range of 3 to 10 characters; we remove any document with a symbol-to-word ratio greater than 0.1 for either the hash symbol or the ellipsis; and we remove any document with more than 90% of lines starting with a bullet point, or more than 30% ending with an ellipsis. We also require that 80% of words in a document contain at least one alphabetic character, and apply a "stop word" filter, to remove documents that do not contain at least two of the following English words: the, be, to, of, and, that, have, with; this adequately deals with ostensibly English documents that contain no coherent English text.

Besides basic "garbage" filters, there can be filters for false statements, offensive comments, personally identifiable information, and buggy code, etc.  Instead of catching all these filters at pre-training, these filters can also be handled down stream with reinforcement learning (e.g., [Anthropic's helpful and harmless assistant paper](https://www.anthropic.com/index/training-a-helpful-and-harmless-assistant-with-reinforcement-learning-from-human-feedback).  

That being said, most public LLM models have some basic filters for harmfulness. Some some url black-list, Gopher uses Google’s SafeSearch to do more ML based filter.  And there are [new research](https://arxiv.org/pdf/2302.08582.pdf) advocating for earlier stage filtering, due to the observation that "large LMs are quite rresistant to forgetting their training data", and they use some advanced technique from RLHF (see [^1]).

One subarea here is the study of repetition and memorization. [A 2022 paper](https://arxiv.org/pdf/2205.10487.pdf) finds that repeating 0.1% of the data 100 times could lead to a 50% model degradation. [Another recent paper](https://arxiv.org/pdf/2304.11158.pdf) discusses how to tell if a large model memorizes strings by looking at memorization results early in training.

Lastly, there are a couple ideas that I found surprising in cleaning. One idea is that "reducing the diversity of training data can negatively impact alignment with human preferences by decreasing robustness" [source](https://arxiv.org/pdf/2302.08582.pdf) via [Hendrycks et al.](https://arxiv.org/abs/2004.06100). So having some unaligned contents could _help_ with alignment. Another idea is that some "junk", such as typos and bad formats, are helpful for robustness; since user input might also contain typos and the like.


# Curation

Curation is deciding what data gets included and at what proportions. Example questions include: does the dataset include just english text, or foreign language text? (how much of each language?), and does the dataset also include images (see [CLIP](https://openai.com/research/clip)), audio, and videos? This can depend on downstream usecases and dataset sizes needed.

One big research finding in curation is determining how much data to have based on the training capacity “given a fixed FLOPs budget, how should one trade-off model size and the number of training tokens”. Here is an excerpt from the [Chinchilla paper](https://arxiv.org/abs/2203.15556):

> given a 10× increase computational budget, [they](https://arxiv.org/abs/2001.08361) suggest that the size of the model should increase 5.5× while the number of training tokens should only increase 1.8×. Instead, we find that model size and the number of training tokens should be scaled in equal proportions.

Gathering new data and navigating the dynamics is fair use is also an active area of work. Besides the big sources like [Common Crawl](https://commoncrawl.org/), there is a long tail of data to collect, and the main issue is the cost-effectiveness.  In a regime where terabytes of data are needed, sources with less than gygabytes may not worth the effort.

# Scheduling

Scheduling is deciding when the model sees what data in its training process. The main idea revolves around [curriculum learning](https://dl.acm.org/doi/10.1145/1553374.1553380):

> “Humans and animals learn much better when the examples are not randomly presented but organized in a meaningful order which illustrates gradually more concepts, and gradually more complex ones.”

It's still a very active area of research!


And that's my quick overview!

[^1]: LLM training contains many steps after the initial training, clsutered under the "fine-tuning" bucket. You can read more details in Jesse's [exellent lecture](https://www.youtube.com/watch?v=SXpJ9EmG3s4). It's also especially helpful for getting the context of canonical evaluations for models, a background anyone in pre-training needs.
