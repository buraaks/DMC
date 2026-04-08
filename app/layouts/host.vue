<template>
  <div class="min-h-screen bg-[color:var(--page-bg)]">
    <UContainer class="flex min-h-screen flex-col gap-6 py-6 lg:flex-row">
      <HostSidebar />
      <main class="flex-1 rounded-[2rem] border border-[color:var(--surface-border)] bg-[color:var(--surface-panel-strong)] p-5 shadow-[var(--shadow-soft)] md:p-8">
        <slot />
      </main>
    </UContainer>
  </div>
</template>
