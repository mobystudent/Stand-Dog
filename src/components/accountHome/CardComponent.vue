<template>
  <div class="card-container">
    <div class="card-column">
      <h3 class="card-title">{{ title }}</h3>
      <p class="card-description">{{ description }}</p>
      <a :href="linkUrl" class="card-link">{{ linkText }}</a>
    </div>
    <div class="card-icons">
      <img
        class="icon icon--printer"
        src="/static/icons/printer.svg"
        alt="Print"
        @click="printDocument"
      />
      <img
        class="icon icon--email"
        src="/static/icons/mail.svg"
        alt="Send Email"
        @click="sendEmail"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'CardComponent',
  props: {
    title: { type: String, required: true },
    description: { type: String, required: true },
    linkUrl: { type: String, required: true },
    linkText: { type: String, default: 'View/Renew' }
  },
  setup(props) {
    const printDocument = () => {
      // window.print();
    }

    const sendEmail = () => {
      const mailtoLink = `mailto:?subject=${encodeURIComponent(props.title)}`
      window.location.href = mailtoLink
    }

    return {
      printDocument,
      sendEmail
    }
  }
}
</script>

<style lang="scss" scoped>
.card-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
}

.card-column {
  flex: 1;
}

.card-title {
  color: #1d1d1f;
  font-weight: 700;
  font-size: 18px;
  line-height: 1.4;
  letter-spacing: 0.2px;
}

.card-description {
  color: #616165;
  font-weight: 500;
  font-size: 12px;
  line-height: 1.4;
  padding-bottom: 8px;
}

.card-link {
  color: #0066cc;
  font-weight: 500;
  font-size: 14px;
  line-height: 1.3;
  letter-spacing: -0.2px;
}

.card-icons {
  display: flex;
  column-gap: 16px;

  .icon {
    width: 24px;
    height: 24px;
    transition: opacity 0.2s;
    cursor: pointer;

    &:hover {
      opacity: 0.7;
    }
  }
}
</style>
